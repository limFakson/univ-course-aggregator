import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { sampleCourses } from '../data/courses';
import { CourseCard } from "../components/CourseCard";
import { SearchAndFilter } from "../components/SearchAndFilter";
import { Pagination } from "../components/Pagination";
import ComparePanel from "../components/ComparePanel";
import {
  filterCourses,
  paginateCourses,
  getUniqueValues,
} from "../utils/courseUtils";
import { getCourses, getDepartments, getUniversities } from "../services/api";

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [dept, setDept] = useState([]);
  const [uni, setUni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedDepartment, setSelectedDeprtment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const cachedCourses = JSON.parse(localStorage.getItem("courses"));
    if (cachedCourses?.length) setCourses(cachedCourses);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const [courseRes, deptRes, uniRes] = await Promise.all([
          getCourses(),
          getDepartments(),
          getUniversities(),
        ]);

        setCourses(courseRes.data.courses || []);
        setDept(deptRes.data || []);
        setUni(uniRes.data || []);

        // ✅ Extract unique universities, departments, and locations
        const uniList = getUniqueValues(uniRes.data, "name");
        const deptList = getUniqueValues(deptRes.data, "name");
        const locList = getUniqueValues(courseRes.data.courses, "location");

        // ✅ Store raw courses in localStorage
        localStorage.setItem("courses", JSON.stringify(courseRes.data.courses));
        localStorage.setItem("universities", JSON.stringify(uniList));
        localStorage.setItem("departments", JSON.stringify(deptList));
        localStorage.setItem("locations", JSON.stringify(locList));

        window.dispatchEvent(new Event("storage-update"));
      } catch (err) {
        if (courses == null) {
        }
        setError(err.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchFilteredCourses = async () => {
      try {
        setLoading(true);
        const params = {};

        if (selectedUniversity) {
          const uniObj = uni.find((u) => u.name === selectedUniversity);
          if (uniObj) params.university_id = uniObj.id;
        }

        if (selectedDepartment) {
          const deptObj = dept.find((d) => d.name === selectedDepartment);
          if (deptObj) params.department_id = deptObj.id;
        }

        const res = await getCourses(params);
        setCourses(res.data.courses || []);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || "Failed to filter courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCourses();
  }, [selectedUniversity, selectedDepartment]);

  // Get unique values for filters
  const universities = useMemo(() => uni, [uni]);

  const departments = useMemo(() => dept, [dept]);
  const locations = useMemo(
    () => getUniqueValues(courses, "location"),
    [courses]
  );

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return filterCourses(courses, searchTerm, selectedLocation);
  }, [courses, searchTerm, selectedUniversity, selectedLocation]);

  // Paginate the filtered courses
  const paginatedCourses = useMemo(() => {
    return paginateCourses(filteredCourses, currentPage, ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleUniversityChange = (value) => {
    setSelectedUniversity(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value) => {
    setSelectedDeprtment(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedUniversity("");
    setSelectedDeprtment("");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSelect = (course) => {
    if (selected.find((c) => c.id === course.id)) {
      setSelected(selected.filter((c) => c.id !== course.id));
    } else {
      setSelected([...selected, course]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            University Course Aggregator
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover courses from top universities
          </p>
        </header>

        {/* Loading & Error States */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading courses...
          </p>
        )}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <>
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedUniversity={selectedUniversity}
              onUniversityChange={handleUniversityChange}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              universities={universities}
              departments={departments}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={handleDepartmentChange}
              locations={locations}
              onClearFilters={handleClearFilters}
            />

            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredCourses.length === 0
                  ? "No courses found matching your criteria"
                  : `${filteredCourses.length} course${
                      filteredCourses.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            {/* Course grid */}
            {paginatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                    onSelect={toggleSelect}
                    selected={!!selected.find((c) => c.id === course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No courses match your search criteria.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredCourses.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
        <ComparePanel selected={selected} onClose={() => setSelected([])} />
      </div>
    </div>
  );
};

export default Index;
