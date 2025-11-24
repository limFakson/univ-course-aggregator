# scraper.py
import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

import requests
from slugify import slugify
from bs4 import BeautifulSoup
from backend.database.crud import get_or_create_university, get_or_create_department, upsert_course
from backend.database.database import SessionLocal
from urllib.parse import urljoin
import re
from datetime import datetime

BASE_DEPT_PAGE = "https://www.southampton.ac.uk/about/faculties-schools-departments"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; CourseAggregator/1.0; +https://example.com)"
}

def extract_course_links_from_dept(slug:str) ->list:
    resp = requests.get(f"{BASE_DEPT_PAGE}/{slug}", headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    links = set()

    # Look for internal links that may point to course pages or course listings
    for a in soup.find_all("a", href=True):
        href = a["href"]
        full = urljoin(BASE_DEPT_PAGE, href)
        # Heuristics: include links with 'msc', 'mres', 'postgraduate', 'taught', 'courses'
        if re.search(r"(msc|mres|postgraduate|taught|courses|masters)", href, re.I):
            links.add(full)

    # Also look for specific 'Our courses' section links (if any) — some might be relative
    return list(links)

def scrape_course_page(url:str)->dict:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title
    title_tag = soup.find(["h1", "h2"])
    title = title_tag.get_text(strip=True) if title_tag else None

    # Summary: first paragraph-ish
    summary = None
    p = soup.find("p")
    if p:
        summary = p.get_text(strip=True)

    # Try to find duration, mode, fees lines by label keywords
    text = soup.get_text(" ", strip=True)

    # Duration heuristic
    duration = None
    m = re.search(r"(\d+\s*(?:year|years|month|months))", text, re.I)
    if m:
        duration = m.group(1)

    # Mode (full-time/part-time)
    mode = None
    if re.search(r"full[-\s]*time", text, re.I):
        mode = "Full-time"
    elif re.search(r"part[-\s]*time", text, re.I):
        mode = "Part-time"

    # --- Fees Section Parsing
    fees_section = None
    fees_detail = None
    fees_summary = None
    uk_fee = None
    intl_fee = None

    tuition_section = soup.find(string=re.compile(r"Tuition fees", re.I))
    if tuition_section:
        # Grab nearby text
        section_text = ""
        for elem in tuition_section.parent.find_all_next(["p", "li"], limit=10):
            section_text += elem.get_text(" ", strip=True) + "\n"
        fees_section = section_text.strip()

        # Extract specific fees
        uk_match = re.search(r"UK students pay\s*(£[0-9,\.]+)", fees_section, re.I)
        intl_match = re.search(r"(EU and international students|International students)\s*pay\s*(£[0-9,\.]+)", fees_section, re.I)

        if uk_match:
            uk_fee = uk_match.group(1)
        if intl_match:
            intl_fee = intl_match.group(2)

        # Build a readable summary
        if uk_fee and intl_fee:
            fees_summary = f"UK: {uk_fee} | International: {intl_fee}"
        elif uk_fee:
            fees_summary = f"UK: {uk_fee}"
        elif intl_fee:
            fees_summary = f"International: {intl_fee}"

        fees_detail = fees_section

    # fallback if tuition section not found
    if not fees_summary:
        generic_fee = re.search(r"(£\s?\d[\d,\.]*)", text)
        if generic_fee:
            fees_summary = generic_fee.group(1)

    # --- Entry Requirements Section
    requirements = None
    req_anchor = soup.find(string=re.compile(r"Entry requirements", re.I))
    if req_anchor:
        req_text = ""
        for elem in req_anchor.parent.find_all_next(["p", "li"], limit=10):
            t = elem.get_text(" ", strip=True)
            if re.search(r"Fees|How to apply|Tuition", t, re.I):
                break
            req_text += t + "\n"
        requirements = req_text.strip()

    return {
        "title": title,
        "summary": summary,
        "duration": duration,
        "mode": mode,
        "fees": fees_summary,
        "fees_detail": fees_detail,
        "requirements": requirements,
        "link": url,
        "location": "Southampton, UK"
    }

def refresh_biological_sciences(dept_name:str, dept_slug:str=None, uni_name:str=None)->dict:
    db = SessionLocal()
    try:
        slug = slugify(dept_name)
        uni = get_or_create_university(db, name=uni_name, country="UK", website="https://www.southampton.ac.uk")
        dept = get_or_create_department(db, name=dept_name, university_id=uni.id, slug=dept_slug)

        links = extract_course_links_from_dept(slug)
        print(f"Found {len(links)} candidate links to scan.")

        created = 0
        updated = 0
        for link in links:
            
            data = scrape_course_page(link)
            if not data:
                continue

            title = data.get("title") or ""
            if not re.search(r"(MSc|MRes|Master|Postgraduate|Taught)", title, re.I) and not re.search(r"(MSc|MRes|masters|postgraduate)", link, re.I):
                
                continue

            course, is_new = upsert_course(db, department_id=dept.id, course_data=data)
            if is_new:
                created += 1
            else:
                updated += 1

        return {"created": created, "updated": updated}
    finally:
        db.close()
        
refresh_biological_sciences('School of Engineering', 'engineering-school', 'University of Southampton')
