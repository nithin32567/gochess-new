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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moduleLessons, setModuleLessons] = useState({}); // Store lessons per module
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [error, setError] = useState(null);
  const { courseDetails, modules, lessons } = useSelector(
    (state) => state.course
  );

  console.log(courseDetails, 'course details')
  console.log(modules, "modules===============================");
  console.log(lessons, "lessons===============================");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingModules(true);
      setError(null);
      try {
        await dispatch(fetchCourseDetails(id));
        await dispatch(fetchModulesByCourseId(id));
      } catch (err) {
        setError("Failed to load course data");
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  // Update moduleLessons when lessons change
  useEffect(() => {
    if (lessons && lessons.length > 0 && expandedIndex !== null && modules[expandedIndex]) {
      const currentModuleId = modules[expandedIndex]._id;
      setModuleLessons(prev => ({
        ...prev,
        [currentModuleId]: lessons
      }));
    }
  }, [lessons, expandedIndex, modules]);

  const handleExpand = async (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      const moduleId = modules[index]._id;

      // Only fetch lessons if we don't have them cached
      if (!moduleLessons[moduleId]) {
        try {
          await dispatch(fetchLessonsByModuleId(moduleId));
        } catch (err) {
          console.error("Error fetching lessons:", err);
        }
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Calculate total duration for a module
  const calculateModuleDuration = (moduleLessons) => {
    if (!moduleLessons || moduleLessons.length === 0) return 0;
    return moduleLessons.reduce((total, lesson) => {
      return total + (parseInt(lesson.lesson_duration) || 0);
    }, 0);
  };

  // Get lessons for a specific module
  const getModuleLessons = (moduleId) => {
    return moduleLessons[moduleId] || [];
  };

  console.log(courseDetails, "courseDetails===============================");

  return (
    <div>
      <section className="course-single-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-8 col-lg-8 pe-xl-5">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
                  title="YouTube video"
                  allowFullScreen=""
                />
              </div>
              <div className="course-description">
                <h4>{courseDetails?.course_title || "Course Title"}</h4>
                <p>
                  {courseDetails?.description || "Course description will appear here."}
                </p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 course-content-div">
              <h4>
                <i className="fa-solid fa-book-open" /> Course Content
              </h4>
              <ul>
                {error ? (
                  <li>
                    <div className="w-full text-left p-3 text-red-500">
                      <p>{error}</p>
                    </div>
                  </li>
                ) : isLoadingModules ? (
                  <li>
                    <div className="w-full text-left p-3 text-gray-500">
                      <p>Loading modules...</p>
                    </div>
                  </li>
                ) : modules && modules.length > 0 ? (
                  modules.map((module, index) => {
                    const currentModuleLessons = getModuleLessons(module._id);
                    const totalDuration = calculateModuleDuration(currentModuleLessons);
                    const isExpanded = expandedIndex === index;

                    return (
                      <li key={module._id}>
                        <button
                          onClick={() => handleExpand(index)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <h5 className="font-medium text-gray-800 mb-1">
                            {module.module_title || `Module ${index + 1}`}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {currentModuleLessons.length} lessons | {totalDuration}min
                          </p>

                          {isExpanded && currentModuleLessons.length > 0 && (
                            <div className="mt-3 pl-4 space-y-2">
                              {currentModuleLessons.map((lesson) => (
                                <div key={lesson._id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <TiTick size={16} className="text-green-500 flex-shrink-0" />
                                  <span>{lesson.lesson_title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li>
                    <div className="w-full text-left p-3 text-gray-500">
                      <p>No modules available for this course.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewCourseDetails;
