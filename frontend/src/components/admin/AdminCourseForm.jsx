import React, { useState, useEffect } from "react";

const AdminCourseForm = ({ onSave, editingCourse, departments = [], loading }) => {
  const [form, setForm] = useState({
    title: "",
    duration: "",
    mode: "",
    location: "",
    fees: "",
    fees_detail: "",
    requirements: "",
    link: "",
    department_id: "",
  });

  useEffect(() => {
    if (editingCourse) setForm(editingCourse);
  }, [editingCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border border-black p-3">
      {/* <h2 className="font-semibold mb-2">
        {editingCourse ? "Edit Course" : "Add New Course"}
      </h2> */}

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="border border-gray-400 p-2 w-full text-sm"
          required
        />

        <select
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
          className="border border-gray-400 p-2 text-sm"
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration"
          className="border border-gray-400 p-2 text-sm"
        />
        <input
          type="text"
          name="mode"
          value={form.mode}
          onChange={handleChange}
          placeholder="Mode"
          className="border border-gray-400 p-2 text-sm"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border border-gray-400 p-2 text-sm"
        />
        <input
          type="text"
          name="fees"
          value={form.fees}
          onChange={handleChange}
          placeholder="Fees Summary"
          className="border border-gray-400 p-2 text-sm"
        />
        <textarea
          name="fees_detail"
          value={form.fees_detail}
          onChange={handleChange}
          placeholder="Fees Details"
          className="border border-gray-400 p-2 text-sm col-span-2"
        />
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          placeholder="Requirements"
          className="border border-gray-400 p-2 text-sm col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-3 border border-black px-3 py-1 text-sm"
      >
        {loading
          ? "Saving..."
          : editingCourse
          ? "Update Course"
          : "Add Course"}
      </button>
    </form>
  );
};

export default AdminCourseForm;
