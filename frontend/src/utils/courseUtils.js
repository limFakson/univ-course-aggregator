
export const filterCourses = (
  courses,
  searchTerm,
  selectedLocation
) => {
  return courses.filter((course) => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !selectedLocation || 
      course.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });
};

export const paginateCourses = (
  courses,
  currentPage,
  itemsPerPage
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return courses.slice(startIndex, endIndex);
};

export const getUniqueValues = (courses, field) => {
  const getValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const values = courses.map(course => getValue(course, field));
  return Array.from(new Set(values.filter(Boolean))).sort();
};