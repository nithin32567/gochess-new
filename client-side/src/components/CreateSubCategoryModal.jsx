import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubcategory,
  fetchSubcategoriesByCategory,
} from "@/redux/course.slice";

const CreateSubCategoryModal = ({ setIsAddSubcategoryModalOpen }) => {
  console.log(setIsAddSubcategoryModalOpen, "setIsAddSubcategoryModalOpen");
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.course);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    subcategory_name: "",
    category_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(createSubcategory(formData));
      console.log(response, "response");
      setIsAddSubcategoryModalOpen(false); // Callback to refresh subcategories list
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  useEffect(() => {
    if (formData.category_id) {
      console.log(formData.category_id, "formData.category_id");
      dispatch(fetchSubcategoriesByCategory(formData.category_id)).then(
        (response) => {
          console.log(response, "response");
          setSubcategories(response.payload);
        }
      );
    }
  }, [formData.category_id]);

  return (
    <div className="fixed inset-0 bg-[#000000d3] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Subcategory
          </h2>
          <button
            onClick={() => setIsAddSubcategoryModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subcategory_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subcategory Name
            </label>
            <input
              type="text"
              id="subcategory_name"
              name="subcategory_name"
              value={formData.subcategory_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subcategory name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parent Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsAddSubcategoryModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Subcategory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubCategoryModal;
