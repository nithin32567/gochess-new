import React, { useEffect, useState } from "react";
import CourseCard from "../../../components/tenants/CourseCard";
import AddCourseModal from "../../../components/tenants/AddCourseModal";
import { useDispatch, useSelector } from "react-redux";
import {
 fetchCategories,
 fetchSubcategories,
 fetchLevels,
 fetchLanguages,
 searchCourses,
 fetchCourses,
} from "@/redux/course.slice";
import Popup from "../../../components/popup";
function TenantCourses() {
 const dispatch = useDispatch();
 const [searchValue, setSearchValue] = useState("");
 const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
 const [selectedCategory, setSelectedCategory] = useState("all");
 const [selectedLevel, setSelectedLevel] = useState("all");
 // const [allCourses, setAllCourses] = useState([]);
 const [filteredCourses, setFilteredCourses] = useState([]);
 const { categories, levels, pagination, courses } = useSelector((state) => state.course);

 // const { courses, categories } = useSelector((state) => state.course);
 // console.log(courses, "courses");

 const [page, setPage] = useState(1);

 useEffect(() => {
  dispatch(fetchCategories());
  dispatch(fetchSubcategories());
  dispatch(fetchLevels());
  dispatch(fetchLanguages());
  dispatch(fetchCourses());
 }, [dispatch]);

 // In-memory filtering logic
 useEffect(() => {
  let filtered = courses;
  if (selectedCategory !== "all") {
   filtered = filtered.filter(
    (course) => course.category?._id === selectedCategory
   );
  }
  if (selectedLevel !== "all") {
   filtered = filtered.filter(
    (course) => course.level?._id === selectedLevel
   );
  }
  // Search filter (if searchValue is present)
  if (searchValue) {
   const search = searchValue.trim().toLowerCase();
   filtered = filtered.filter(
    (course) =>
     (course.course_title && course.course_title.toLowerCase().startsWith(search)) ||
     (course.description && course.description.toLowerCase().startsWith(search))
   );
  }
  setFilteredCourses(filtered);
 }, [courses, selectedCategory, selectedLevel, searchValue]);

 const handleCategoryChange = (categoryId) => {
  setSelectedCategory(categoryId);
  setSelectedLevel("all"); // Reset level when category changes
  setSearchValue(""); // Clear search when filter changes
 };

 const handleLevelChange = (levelId) => {
  setSelectedLevel(levelId);
  setSearchValue(""); // Clear search when filter changes
 };

 return (
  <>
   <main className="container-wrapper-scroll">
    <section
     style={{ minHeight: "max-content", paddingBottom: "2rem" }}
     className="course-single-page container-height"
    >
     <div className="container-fluid">
      <div className="row justify-content-center">
       <div className="col-lg-2 col-md-3 col-6">
        <button
         onClick={() => setIsAddCourseModalOpen(true)}
         className="addtenant-btn">
         <i className="fa-solid fa-plus"></i> Add Tenant
        </button>
       </div>
      </div>
     </div>
    </section>
    <section className="search-section">
     <div className="container-fluid">
      <div className="row">
       <div className="col-xl-8 col-lg-6 col-sm-12 mb-sm-4">
        <div className="search-course">
         <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder="Search courses..."
         />
         <button>
          <i className="fa-solid fa-magnifying-glass" />
         </button>
        </div>
       </div>
       <div className="col-xl-2 col-lg-3 col-sm-6">
        <select
         value={selectedCategory}
         onChange={(e) => handleCategoryChange(e.target.value)}
         name="" id="">
         <option value="all">All Categories</option>
         {categories &&
          categories.map((category, index) => (
           <option key={index} value={category._id}>
            {category.category}
           </option>
          ))}
        </select>
       </div>
       <div className="col-xl-2 col-lg-3 col-sm-6">
        <select
         value={selectedLevel}
         onChange={(e) => handleLevelChange(e.target.value)}
         name="" id="">
         <option value="all">All Levels</option>
         {levels &&
          levels.map((level, index) => (
           <option key={index} value={level._id}>
            {level.course_level}
           </option>
          ))}
        </select>
       </div>
      </div>
     </div>
    </section>

    <section className="createcourse-wrapper ourcourse-page">
     <div className="container-fluid">
      <div className="row">

       {/* {filteredCourses && filteredCourses.length == 0 ? ( */}
       {true ? (
        (JSON.parse(localStorage.getItem("st-courses"))).map((course, index) => {
         return (
          <div key={index} className="col-xl-3 col-lg-3 col-sm-6">
           <a href="#" className="ourcourse-item-div">
            <div className="course-image">
             <img src="/img/chessthumbnail.jpg" alt="Chess" />
            </div>
            <div className="course-content">
             <h4>
              <font>
               {course.course_title}
              </font>
              {course.short_description}
             </h4>
            </div>
            <h6>
             <i className="fa-regular fa-clock" /> Starts on: {course.start_date}
            </h6>
           </a>
          </div>
         )
        })
       ) : (
        <div className="col-span-full text-center text-gray-500 py-8">
         No Course found
        </div>
       )}
      </div>
     </div>
    </section>

   </main >


   <div className="w-full px-12 py-12 flex flex-col gap-6">
    <div className="flex justify-between items-center">
     <h1 className="text-2xl font-bold">Courses</h1>
     <button
      onClick={() => setIsAddCourseModalOpen(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
     >
      Add Course
     </button>
    </div>

    {/* Search and Filter Section */}
    <div className="flex gap-4">
     <input
      type="text"
      placeholder="Search courses..."
      className="px-4 py-2 border rounded-md flex-1"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
     />
     <select
      className="px-4 py-2 border rounded-md"
     // onChange={(e) => dispatch(filterCoursesByCategory(e.target.value))}
     >
      <option value="all">All Categories</option>
      {categories &&
       categories.map((category, index) => (
        <option key={index} value={category._id}>
         {category.category}
        </option>
       ))}
     </select>
     <select className="px-4 py-2 border rounded-md">
      <option value="">All Levels</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
     </select>
    </div>

    {/* Courses Grid */}
    <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {courses &&
      courses.map((course, index) => (
       <CourseCard key={index} course={course} />
      ))}
    </div>
    {isAddCourseModalOpen && (
     <Popup>
      <AddCourseModal setIsAddCourseModalOpen={setIsAddCourseModalOpen} />
     </Popup>
    )}
   </div>
  </>
 );
};

export default TenantCourses;
