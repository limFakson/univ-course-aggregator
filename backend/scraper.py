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

BASE_DEPT_PAGE = "https://www.southampton.ac.uk/about/faculties-schools-departments/school-of-geography-and-environmental-science"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; CourseAggregator/1.0; +https://example.com)"
}

def extract_course_links_from_dept():
    resp = requests.get(BASE_DEPT_PAGE, headers=HEADERS, timeout=15)
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

def scrape_course_page(url):
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

    # Fees: look for '£' or '£' + numbers or 'Fees' label
    fees = None
    m = re.search(r"(£\s?[\d,]+(?:\.\d+)?(?:\s?per year|\s?total)?)", text)
    if m:
        fees = m.group(1)
    else:
        # alternative: look for 'Fees' label
        fee_label = soup.find(string=re.compile(r"Fees", re.I))
        if fee_label:
            parent = fee_label.parent
            next_text = parent.find_next(string=True)
            if next_text:
                fees = next_text.strip()

    return {
        "title": title,
        "summary": summary,
        "duration": duration,
        "mode": mode,
        "fees": fees,
        "link": url,
        "location": "Southampton, UK"
    }

def refresh_biological_sciences(dept_name:str, slug:str=None, uni_name:str="University of Southampton"):
    db = SessionLocal()
    try:
        slug = slugify(dept_name) if slug is None else slug
        uni = get_or_create_university(db, name=uni_name, country="UK", website="https://www.southampton.ac.uk")
        dept = get_or_create_department(db, name=dept_name, university_id=uni.id, slug=slug)

        links = extract_course_links_from_dept()
        print(f"Found {len(links)} candidate links to scan.")

        created = 0
        updated = 0
        for link in links:
            # Some links might be listing pages — we try to detect actual course pages by presence of MSc/MRes in title/text
            data = scrape_course_page(link)
            if not data:
                continue

            title = data.get("title") or ""
            if not re.search(r"(MSc|MRes|Master|Postgraduate|Taught)", title, re.I) and not re.search(r"(MSc|MRes|masters|postgraduate)", link, re.I):
                # Skip links that don't look like course pages
                continue

            course, is_new = upsert_course(db, department_id=dept.id, course_data=data)
            if is_new:
                created += 1
            else:
                updated += 1

        return {"created": created, "updated": updated}
    finally:
        db.close()

if __name__ == "__main__":
    print(refresh_biological_sciences())
