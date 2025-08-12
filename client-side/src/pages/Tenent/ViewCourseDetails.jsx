import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetails } from "@/redux/course.slice";
import { useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";

import {
  fetchModulesByCourseId,
  fetchLessonsByModuleId,
} from "@/redux/course.slice";

const ViewCourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { courseDetails, modules, lessons } = useSelector(
    (state) => state.course
  );
  console.log(lessons, "lessons===============================");
  useEffect(() => {
    dispatch(fetchCourseDetails(id));
    dispatch(fetchModulesByCourseId(id));
  }, [id, dispatch]);
  const handleExpand = (index) => {
    setExpandedIndex(index);
    dispatch(fetchLessonsByModuleId(modules[index]._id));
  };

  console.log(courseDetails, "courseDetails===============================");
  return (
    <div className="container mx-auto h-screen flex flex-col gap-4  ">
      <h1 className="text-3xl font-bold">View Course Details</h1>
      <div className="flex  justify-between gap-4  w-full h-full ">
        {/* left section */}
        <div className="border-r-2 w-2/3 p-4 flex flex-col gap-4 ">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">
              {courseDetails?.course_title} for{" "}
              {courseDetails?.level?.course_level}
            </h1>
            <p className="text-sm text-gray-500">
              {courseDetails.description} Lorem ipsum dolor sit Lorem ipsum
              dolor sit amet, consectetur adipisicing elit. Accusantium sunt
              repellendus asperiores consequuntur! Cupiditate quas recusandae
              aliquam, sequi officiis accusamus eveniet esse tempore assumenda
              sed praesentium, ipsa saepe, nesciunt ut? amet consectetur
              adipisicing elit. Nihil libero, nulla, repellat numquam dolor
              magnam neque iure minus, incidunt in enim sint asperiores.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* image section */}
            <div className="flex flex-col gap-4">
              <img
                className="  h-full object-cover rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.35)] "
                src={courseDetails?.image}
                alt="course image"
              />
            </div>
            <div className="flex flex-col gap-4 my-6   border-2 border-gray-200 rounded-lg p-4 text-gray-500 justify-center items-center">
              {/* other details */}
              {/* first row */}
              <div className="flex w-full justify-between items-center ">
                {/* left side */}
                <div className="w-full">
                  <p className="text-lg font-bold">Instructors</p>
                  {courseDetails?.instructors &&
                  courseDetails.instructors.length > 0 ? (
                    courseDetails.instructors.map((instructor) => (
                      <div
                        className=""
                        key={instructor._id}
                        style={{ listStyleType: "disc" }}
                      >
                        <p className="text-sm font-bold text-gray-500">
                          {instructor.fname + " " + instructor.lname}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-gray-500">
                      No Instructor Assigned Yet
                    </p>
                  )}
                </div>

                {/* right side */}
                <div className="w-full flex flex-col gap-2 text-right ">
                  <p className="text-lg font-bold">Category</p>
                  <div
                    className="   "
                    key={courseDetails?.category?._id}
                    style={{ listStyleType: "disc" }}
                  >
                    <p className="text-sm font-bold  ">
                      {courseDetails?.category?.category}
                    </p>
                  </div>
                </div>
              </div>
              {/* second row */}
              <div className="flex w-full justify-between items-center">
                <div className="w-full">
                  <p className="text-lg font-bold">Subcategory</p>
                  <div className=" " key={courseDetails?.subcategory?._id}>
                    <p className="text-sm font-bold ">
                      {courseDetails?.subcategory?.subcategory_name}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2 text-right ">
                  <p className="text-lg font-bold">Language</p>
                  <div className=" " key={courseDetails?.language?._id}>
                    <p className="text-sm font-bold ">
                      {courseDetails?.language?.language}
                    </p>
                  </div>
                </div>
              </div>
              {/* third row */}
              <div className="flex w-full justify-between items-center">
                <div className="flex w-full justify-between items-center text-left">
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-lg font-bold">Price</p>
                    <p className="text-sm font-bold ">
                      $ {courseDetails?.price || "567"}
                    </p>
                  </div>
                </div>
                {/* fourth row */}
                <div className="flex w-full justify-between items-center text-right">
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-lg font-bold">Max Enrollment</p>
                    <p className="text-sm font-bold ">
                      {courseDetails?.max_enrollment || "567"}
                    </p>
                  </div>
                </div>
              </div>
              {/* fourth row start date and end date */}
              <div className="flex w-full justify-between items-center">
                <div className="w-full flex flex-col gap-2 text-left">
                  <p className="text-lg font-bold">Start Date</p>
                  <p className="text-sm font-bold ">
                    {courseDetails?.start_date
                      ? new Date(courseDetails?.start_date).toLocaleDateString()
                      : "567"}
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 text-right">
                  <p className="text-lg font-bold">End Date</p>
                  <p className="text-sm font-bold ">
                    {courseDetails?.end_date
                      ? new Date(courseDetails?.end_date).toLocaleDateString()
                      : "567"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right section course countnt */}
        <div className="w-1/3 bg-white p-4 h-full rounded-xl shadow-sm overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Content Covered
            </h2>
            <button
              onClick={() => setExpandedIndex(null)}
              className="text-sm font-medium text-purple-600 hover:underline"
            >
              Expand all
            </button>
          </div>

          {modules?.map((module, index) => (
            <div
              key={module._id}
              className="border-t py-3 cursor-pointer"
              onClick={() => handleExpand(index)}
            >
              <div className="flex items-center justify-between  text-3xl  ">
                <p className=" font-semibold flex items-center gap-2 text-indigo-600">
                  {String(index + 1).padStart(2, "0")}{" "}
                  <span className="text-lg text-gray-800">
                    {module.module_title}
                  </span>
                </p>
                <span className=" text-2xl text-indigo-600">
                  {expandedIndex === index ? "▲" : "▼"}
                </span>
              </div>

              {expandedIndex === index && (
                <div className="pl-4 mt-2">
                  {lessons?.length > 0 ? (
                    lessons.map((lesson) => (
                      <p
                        key={lesson._id}
                        className="text-sm flex items-center gap-4 font-semibold text-gray-600 py-1 border-b border-dotted hover:text-indigo-600 "
                      >
                        <TiTick size={20} className="text-green-500" />
                        {lesson.lesson_title}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No lessons yet
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCourseDetails;
