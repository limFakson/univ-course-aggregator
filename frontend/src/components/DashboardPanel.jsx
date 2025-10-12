import React, { useEffect, useState } from "react";

const DashboardSummary = () => {
  const [summary, setSummary] = useState({
    courses: 0,
    universities: 0,
    departments: 0,
  });

  useEffect(() => {
    const updateSummaryFromCache = () => {
      try {
        const cachedCourses = JSON.parse(localStorage.getItem("courses")) || [];
        const cachedUniversities = JSON.parse(localStorage.getItem("universities")) || [];
        const cachedDepartments = JSON.parse(localStorage.getItem("departments")) || [];

        setSummary({
          courses: Array.isArray(cachedCourses)
            ? cachedCourses.length
            : cachedCourses.total || 0,
          universities: cachedUniversities.length,
          departments: cachedDepartments.length,
        });
      } catch (err) {
        console.warn("DashboardSummary: failed to read cache", err);
      }
    };

    // Run once on mount
    updateSummaryFromCache();

    // Listen for storage updates
    window.addEventListener("storage-update", updateSummaryFromCache);
    return () => window.removeEventListener("storage-update", updateSummaryFromCache);
  }, []);

  return (
    <div className="border-b border-black p-3 flex justify-around text-sm font-medium">
      <div>Courses: {summary.courses}</div>
      <div>Universities: {summary.universities}</div>
      <div>Departments: {summary.departments}</div>
    </div>
  );
};

export default DashboardSummary;
