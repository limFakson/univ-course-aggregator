import React, { useEffect, useState } from "react";
import AdminCourseForm from "../components/admin/AdminCourseForm";
import AdminCourseList from "../components/admin/AdminCourseList";
import Modal from "../components/Modal";
import { createCourse, getDepartments, getCourses } from "../services/api";

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from localStorage or fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        let cachedCourses = JSON.parse(localStorage.getItem("courses")) || [];

        if (cachedCourses.length <= 0) {
          const res = await getCourses();
          cachedCourses = res.data.courses || [];
          localStorage.setItem("courses", JSON.stringify(cachedCourses));
          window.dispatchEvent(new Event("storage-update"));
        }

        setCourses(cachedCourses);
        const depRes = await getDepartments();
        setDepartments(depRes.data);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem("courses", JSON.stringify(courses));
      window.dispatchEvent(new Event("storage-update"));
    }
  }, [courses]);

  const handleSave = async (course) => {
    try {
      setLoading(true);
      setMessage("");

      const payload = {
        title: course.title,
        duration: course.duration,
        mode: course.mode,
        location: course.location,
        fees: course.fees,
        fees_detail: course.fees_detail,
        requirements: course.requirements,
        link: course.link,
        department_id: parseInt(course.department_id, 10),
      };

      const res = await createCourse(payload);
      const newCourse = res.data.course;
      setCourses((prev) => [...prev, newCourse]);
      setMessage(res.data.message || "Course created successfully.");

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setMessage("Course deleted locally.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {message && (
        <div className="mb-3 text-sm border border-black p-2 bg-gray-100">
          {message}
        </div>
      )}

      <button
        onClick={() => {
          setEditingCourse(null);
          setIsModalOpen(true);
        }}
        className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white"
      >
        + Add New Course
      </button>

      <AdminCourseList
        courses={courses}
        onEdit={(course) => {
          setEditingCourse(course);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
      >
        <AdminCourseForm
          key={editingCourse ? editingCourse.id : "new"}
          onSave={handleSave}
          editingCourse={editingCourse}
          departments={departments}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default AdminPanel;