import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import LessonAddForm from "../../../components/lessons/LessonAddForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createModuleAndAssignToCourse,
  fetchModulesByCourseId,
} from "../../../redux/course.slice";
const Lessons = ({ course }) => {
  const { modules } = useSelector((state) => state.course);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [courseNames, setCourseNames] = useState([]);
  const [courseId, setCourseId] = useState("");
  const dispatch = useDispatch();

  const handleAddModule = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL
      }/modules/create-module-and-assign-to-course/${courseId}`,
      {
        module_title: moduleTitle,
        module_description: moduleDescription,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response, "response==========================================");
    dispatch(fetchModulesByCourseId(course._id));
    setModuleTitle("");
    setModuleDescription("");
  };
  async function fetchCourseNamesWithId() {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/courses/get-course-names-with-id`,
      {
        withCredentials: true,
      }
    );
    setCourseNames(response.data.data);
    console.log(response, "response==========================================");
  }
  useEffect(() => {
    dispatch(fetchModulesByCourseId(course._id));
  }, [course._id, dispatch]);
  const handleAddModuleToCourse = async (e) => {
    e.preventDefault();
    const module = {
      module_title: moduleTitle,
      module_description: moduleDescription,
      course_id: course._id,
      display_order: 0,
      is_locked: false,
    };

    const response = await dispatch(createModuleAndAssignToCourse(module));
    setModuleTitle("");
    setModuleDescription("");
    dispatch(fetchModulesByCourseId(course._id));
  };

  return (
    <div className="flex flex-col w-full ">
      {/* module add form */}
      <div className="px-12 pt-6">
        <h1 className="text-2xl font-bold">Add Module</h1>
      </div>
      <div className="flex items-center w-full px-12 py-4">
        <form className="flex flex-col gap-4 " onSubmit={handleAddModule}>
          <input
            className="border-none px-4 py-2 rounded-md placeholder:text-sm placeholder:text-gray-500 outline-none bg-slate-200"
            type="text"
            name="module_title"
            placeholder="Module Title"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          />
          <input
            className="border-none px-4 py-2 rounded-md placeholder:text-sm placeholder:text-gray-500 outline-none bg-slate-200"
            type="text"
            name="module_description"
            placeholder="Module Description"
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
          />
          <h1>{course.course_title}</h1>

          <button
            onClick={handleAddModuleToCourse}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            Add Module to Course
          </button>
        </form>
      </div>
      {/* all modules list */}
      <div className="">
        <h1 className="text-2xl font-bold px-12 py-4 border-b border-white">
          All Modules
        </h1>
        <div className=" ">
          {/* assign to course */}
          <div></div>
          {modules &&
            modules.map((module) => (
              <div className="border-b border-gray-300 " key={module._id}>
                <LessonAddForm
                  moduleId={module._id}
                  module={module}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
