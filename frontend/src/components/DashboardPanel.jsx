import React, { useEffect, useState } from "react";

const DashboardSummary = () => {
  const [summary, setSummary] = useState({
    courses: 0,
    universities: 0,
    departments: 0,
  });

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

  useEffect(() => {
    // Initial read
    updateSummaryFromCache();

    // Recheck every 2 seconds in case cache updates later
    const interval = setInterval(updateSummaryFromCache, 2000);

    return () => clearInterval(interval);
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
