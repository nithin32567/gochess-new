import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateSubCategoryModal from "../CreateSubCategoryModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchSubcategories,
  fetchLevels,
  fetchLanguages,
  fetchSubcategoriesByCategory,
  fetchCourses,
} from "@/redux/course.slice";
import { toast } from "react-toastify";
const AddCourseModal = ({ setIsAddCourseModalOpen }) => {
  const { categories, levels, subcategories, languages } = useSelector((state) => state.course);

  console.log(subcategories, 'subcategory modal')
  const dispatch = useDispatch();



  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] =
    useState(false);


  // drop down values are stored only after it is changed
  const [formData, setFormData] = useState({
    course_title: "",
    short_description: "",
    description: "",
    category: categories[0]?._id || "",
    subcategory: subcategories[0]?._id || "",
    language: languages[0]?._id || "",
    level: levels[0]?._id || "",
    max_enrollment: 10,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    drip_content_enabled: false,
  });

  console.log(formData, "formData course 85")

  console.log(formData, "formdata to be submitted");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };




  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
    dispatch(fetchLevels());
    dispatch(fetchLanguages());
  }, [dispatch]);

  // set initial selected category when categories prop loads
  useEffect(() => {
    if (!formData.category && Array.isArray(categories) && categories.length > 0) {
      setFormData((prev) => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories, formData.category]);

  // when subcategories list updates, ensure a default subcategory is selected
  useEffect(() => {
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      const hasExisting = subcategories.some((s) => s._id === formData.subcategory);
      if (!hasExisting) {
        setFormData((prev) => ({ ...prev, subcategory: subcategories[0]._id }));
      }
    }
  }, [subcategories, formData.subcategory]);

  // check the date is not previous and
  // start date should be before end date

  function checkDate() {
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const currentDate = new Date();

    // Check if start date is in the past first
    if (startDate < currentDate) {
      toast.error("Start date cannot be in the past");
      console.log("start date is in the past");
      return false;
    }

    // Only check end date if start date is valid
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date");
      console.log("start date is after end date");
      return false;
    }

    return true;
  }
  const handleSubmit = async (e) => {
    console.log("handleSubmit");
    e.preventDefault();
    try {
      if (
        !formData.course_title ||
        !formData.short_description ||
        !formData.description ||
        !formData.category ||
        !formData.subcategory ||
        !formData.language ||
        !formData.level ||
        !formData.max_enrollment ||
        !formData.start_date ||
        !formData.end_date
      ) {
        toast.error("Please fill all the fields");
        return;
      }
      console.log(formData, "formData inside the handleSubmit");
      if (!checkDate()) {
        console.log("checkDate error");
        toast.error("Please check the date");
        return;
      }
      const courseData = {
        ...formData,
        category: formData.category,
        subcategory: formData.subcategory,
        language: formData.language,
        level: formData.level,
      };
      console.log(courseData, "courseData inside the handleSubmit");

      // Call the API to add the course
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/courses`, courseData, {
        withCredentials: true,
      });
      console.log(response, "response in add course");

      toast.success("Course added successfully");
      setIsAddCourseModalOpen(false);
      dispatch(fetchCourses());
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  useEffect(() => {
    // fetch related categpries on list or list all categories

    if (formData.category) {
      // reset subcategory while loading new list
      setFormData((prev) => ({ ...prev, subcategory: "" }));
      dispatch(fetchSubcategoriesByCategory(formData.category));
    }
  }, [formData.category, dispatch]);

  return (
    <>
      <h1 className="modal-title">Add New Course</h1>
      <button
        onClick={() => setIsAddCourseModalOpen(false)}
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close">
        <i className="fa-solid fa-xmark"></i>
      </button>

      <form
        onSubmit={handleSubmit}
      >
        <div className="trainer-input-item">
          <label
            htmlFor="course_title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Title
          </label>
          <input
            type="text"
            id="course_title"
            name="course_title"
            value={formData.course_title}
            onChange={handleChange}
            placeholder="Enter course title"
            required
          />
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="short_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Short Description
          </label>
          <input
            type="text"
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Enter short description"
            required
          />
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            required
          />
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category._id}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="subcategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subcategory
          </label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Subcategory
            </option>
            {subcategories?.map((item, index) => (
              <option key={index} value={item._id}>
                {item?.subcategory_name}
              </option>
            ))}
          </select>
          {/* <button
      type="button"
      onClick={() => setIsAddSubcategoryModalOpen(true)}
      className="px-4 py-2 text-sm font-medium  text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
     >
      Add Subcategory
     </button> */}
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="language"
          >
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Language
            </option>
            {languages.map((language, index) => (
              <option key={index} value={language._id}>
                {language.language}
              </option>
            ))}
          </select>
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Level
            </option>
            {levels.map((level, index) => (
              <option key={index} value={level._id}>
                {level.course_level}
              </option>
            ))}
          </select>
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="max_enrollment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Enrollment
          </label>
          <input
            type="number"
            id="max_enrollment"
            name="max_enrollment"
            value={formData.max_enrollment}
            onChange={handleChange}
            placeholder="Enter max enrollment"
            required
          />
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="trainer-input-item">
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ height: "20px" }} className="trainer-input-item">
          <input
            style={{ height: "20px", width: "20px", marginRight: "5px" }}
            type="checkbox"
            id="drip_content_enabled"
            name="drip_content_enabled"
            checked={formData.drip_content_enabled}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            style={{ height: "20px" }}
            htmlFor="drip_content_enabled"
            className="ml-2 block text-sm text-gray-900"
          >
            Enable Drip Content
          </label>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <button
              onClick={() => setIsAddCourseModalOpen(false)}
              type="button"
              className="addtrainer-btn">
              Cancel
            </button>
          </div>
          <div className="col-lg-4">
            <button type="submit" className="addtrainer-btn">
              Add Course
            </button>
          </div>
        </div>
      </form>

      {isAddSubcategoryModalOpen && (
        <CreateSubCategoryModal
          setIsAddSubcategoryModalOpen={setIsAddSubcategoryModalOpen}
        />
      )}
    </>
  );
};

export default AddCourseModal;
