import React from "react";

const AdminCourseList = ({ courses, onEdit, onDelete }) => {
  if (!courses.length)
    return <p className="text-gray-600 text-sm mt-3">No courses available.</p>;

  return (
    <div className="border-t border-black pt-3 mt-4">
      <h2 className="font-semibold mb-2">Existing Courses</h2>
      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead className="bg-gray-100 border-b border-gray-400">
          <tr>
            <th className="border border-gray-400 p-2 text-left">Title</th>
            <th className="border border-gray-400 p-2 text-left">University</th>
            <th className="border border-gray-400 p-2 text-left">Department</th>
            <th className="border border-gray-400 p-2 text-left">Duration</th>
            <th className="border border-gray-400 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border border-gray-400 p-2">{course.title}</td>
              <td className="border border-gray-400 p-2">{course.department.university.name}</td>
              <td className="border border-gray-400 p-2">{course.department.name}</td>
              <td className="border border-gray-400 p-2">{course.duration}</td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => onEdit(course)}
                  className="border border-black px-2 py-1 text-xs mr-2 mb-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="border border-black px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourseList;
