import React from "react";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaArchive,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModuleAddModal from "../ModuleAddModal";
import { useNavigate } from "react-router-dom";
const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const {
    course_title,
    category,
    subcategory,
    language,
    studentsEnrolled,
    instructors,
    is_active,
    is_archived,
    level,
  } = course;

  console.log(course, "")
  const [modules] = useState([]);

  const [isAddModuleSectionOpen, setIsAddModuleSectionOpen] = useState(false);



  function showAddModuleSection() {
    setIsAddModuleSectionOpen(true);
  }

  return (
    // <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between w-full">
    //   <div class="col-xl-3 col-lg-3 col-sm-6">
    //     <a href="#" class="ourcourse-item-div">
    //       <div class="course-image"><img src={course?.image} alt="Chess" /></div>
    //       <div class="course-content">
    //         <h4>
    //           <font>Tactic Ninja - Sharpen Your Chess Tactics with a Grandmaster</font>
    //         </h4>
    //         <h3>
    //           <font><i class="fa-solid fa-indian-rupee-sign"></i>999</font><span><i
    //             class="fa-solid fa-indian-rupee-sign"></i>399</span>
    //         </h3>
    //       </div>
    //       <h6><i class="fa-regular fa-clock"></i> 20 total hours</h6>
    //     </a>
    //   </div>
    //   {/* Header Section */}
    //   <div className="flex flex-wrap justify-between items-center mb-4">
    //     <h3 className="text-xl font-semibold text-gray-800">{course_title || "Untitled Course"}</h3>
    //     <div className="flex gap-2">
    //       {is_active && (
    //         <span className="flex items-center gap-1 text-green-600 text-sm">
    //           Active
    //         </span>
    //       )}
    //       {is_archived && (
    //         <span className="flex items-center gap-1 text-gray-600 text-sm">
    //           <FaArchive /> Archived
    //         </span>
    //       )}
    //     </div>
    //   </div>

    //   {/* Category and Level Section */}
    //   <div className="flex gap-4 mb-4">
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">Category</span>
    //       <span className="font-medium">{category?.category || "-"}</span>
    //     </div>
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">Subcategory</span>
    //       <span className="font-medium">{subcategory?.subcategory_name}</span>
    //     </div>
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">Level</span>
    //       <span className="font-medium capitalize">{level?.course_level || "-"}</span>
    //     </div>
    //   </div>

    //   {/* Language Section */}
    //   <div className="mb-4">
    //     <span className="text-sm text-gray-500">Language</span>
    //     <p className="font-medium capitalize">{language?.language || "-"}</p>
    //   </div>

    //   {/* Stats Section */}
    //   <div className="flex gap-6 mb-4">
    //     <div className="flex items-center gap-2">
    //       <FaUsers className="text-blue-500" />
    //       <div>
    //         <span className="text-sm text-gray-500">Students</span>
    //         <p className="font-medium">{studentsEnrolled ?? 0}</p>
    //       </div>
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <FaChalkboardTeacher className="text-blue-500" />
    //       <div className="flex  gap-2 items-center">
    //         <span className="text-sm text-gray-500">Instructors</span>
    //         <p className="font-medium">{instructors?.length || 0}</p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Action Buttons */}
    //   <div className="flex gap-2 mt-4">
    //     <Link to={`/tenant/view-course-details/${course._id}`}>
    //       <button className="px-4 py-2 bg-black  text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors">
    //         View Course Details
    //       </button>
    //     </Link>
    //     <button
    //       onClick={showAddModuleSection}
    //       className="px-4 py-2 bg-black  text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
    //     >
    //       Add Module
    //     </button>
    //   </div>
    //   {/* set accordian to open show modules  associated with  */}
    //   <div className="flex flex-col gap-2">
    //     {modules?.map((module) => (
    //       <div key={module._id} className="border-b border-gray-200 pb-4">
    //         <div className="flex justify-between items-center">
    //           <h3 className="text-lg font-semibold">{module.module_title}</h3>
    //           <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
    //             View Lessons
    //           </button>
    //         </div>
    //         <div className="flex flex-col gap-2">
    //           {module.lessons.map((lesson) => (
    //             <div key={lesson._id}>{lesson.lesson_title}</div>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //   {isAddModuleSectionOpen && (
    //     <ModuleAddModal
    //       setIsAddModuleSectionOpen={setIsAddModuleSectionOpen}
    //       course={course}
    //     />
    //   )}
    // </div>




    <div onClick={() => {
      navigate(`/tenant/view-course-details/${course._id}`);
    }} className="container-fluid w-full">
      <div className="object-fit-cover">
        <a href="#" className="ourcourse-item-div">
          <div className="course-image"><img src={course?.image} alt="Chess" /></div>
          <div className="course-content align-items-center">
            <h4>
              <font>{course_title}</font>
            </h4>
            <h3>
              <font><i className="fa-solid fa-indian-rupee-sign"></i>{course?.original_price || 50}</font><span><i
                className="fa-solid fa-indian-rupee-sign"></i>{course?.price || 46}</span>
            </h3>
          </div>
          <h6><i className="fa-regular fa-clock"></i> 20 total hours</h6>
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
