from database.models import Course
from typing import List, Optional
from mock_data import courses as data

# -----------------------------
# Utils
# -----------------------------
def advanced_filter(
    title: Optional[str],
    university: Optional[str],
    location: Optional[str],
    duration: Optional[str],
    fees: Optional[str],
) -> List[Course]:
    """Advanced filtering on multiple fields (case-insensitive partial match)."""
    results = data
    if title:
        results = [c for c in results if title.lower() in c.title.lower()]
    if university:
        results = [c for c in results if university.lower() in c.university.lower()]
    if location:
        results = [c for c in results if location.lower() in c.location.lower()]
    if duration:
        results = [c for c in results if duration.lower() in c.duration.lower()]
    if fees:
        results = [c for c in results if fees.lower() in c.fees.lower()]
    return results