
export const filterCourses = (
  courses,
  searchTerm,
  selectedUniversity,
  selectedLocation
) => {
  return courses.filter((course) => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUniversity = !selectedUniversity || 
      course.university === selectedUniversity;

    const matchesLocation = !selectedLocation || 
      course.location === selectedLocation;

    return matchesSearch && matchesUniversity && matchesLocation;
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
  const values = courses.map(course => course[field]);
  return Array.from(new Set(values)).sort();
};