import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourses = createAsyncThunk(
  "tenant/fetchCourses",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/courses`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const fetchCourseBySearchValue = createAsyncThunk(
  "tenant/fetchCourseBySearchValue",
  async (searchValue) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/courses/search/${searchValue}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const fetchCategories = createAsyncThunk(
  "tenant/fetchCategories",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/categories`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const fetchCourseDetails = createAsyncThunk(
  "tenant/fetchCourseDetails",
  async (courseId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response inside the fetchCourseDetails");
    return response.data.data;
  }
);

export const fetchSubcategories = createAsyncThunk(
  "tenant/fetchSubcategories",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/subcategories`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const fetchLevels = createAsyncThunk("tenant/fetchLevels", async () => {
  // console.log("fetching levels@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/levels`, {
    withCredentials: true,
  });
  // console.log(response, "levels");
  return response.data.data;
});

export const fetchLanguages = createAsyncThunk(
  "tenant/fetchLanguages",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/languages`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const fetchSubcategoriesByCategory = createAsyncThunk(
  "tenant/fetchSubcategoriesByCategory",
  async (categoryId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/subcategories/${categoryId}`
    );
    console.log(response, "response");
    return response.data.data;
  }
);

export const createCourse = createAsyncThunk(
  "tenant/createCourse",
  async (course) => {
    console.log(course, "course inside the slice 92");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/courses`,
      course,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response");
    return response.data.data;
  }
);

export const createSubcategory = createAsyncThunk(
  "tenant/createSubcategory",
  async (subcategory) => {
    console.log(subcategory, "subcategory");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/subcategories`,
      subcategory,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response");
    return response.data.data;
  }
);

export const createModuleAndAssignToCourse = createAsyncThunk(
  "tenant/createModuleAndAssignToCourse",
  async (module) => {
    console.log(module, "module inside the slice 124");
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL
      }/modules/create-module-and-assign-to-course/${module.course_id}`,
      module,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response");
    return response.data.data;
  }
);

export const searchCourses = createAsyncThunk(
  "tenant/searchCourses",
  async (searchValue) => {
    console.log(searchValue, "searchValue========================");
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/courses/search/course/value/${searchValue}`,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response");
    return response.data.data;
  }
);

export const fetchModulesByCourseId = createAsyncThunk(
  "tenant/fetchModulesByCourseId",
  async (courseId) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/modules/get-modules-associated-with-the-course/${courseId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response inside the fetchModulesByCourseId");
    return response.data.data;
  }
);

export const fetchModules = createAsyncThunk(
  "tenant/fetchModules",
  async (courseId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/modules/${courseId}`
    );
    return response.data.data;
  }
);

// !fetch lessons

export const fetchLessons = createAsyncThunk(
  "tenant/fetchLessons",
  async (moduleId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lessons/${moduleId}`
    );
    console.log(response.data.data, "response inside the fetchLessons");
    return response.data.data;
  }
);

// !lessong api calls

export const fetchLessonsByModuleId = createAsyncThunk(
  "tenant/fetchLessonsByModuleId",
  async (moduleId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/lessons/${moduleId}`
    );
    console.log(
      response.data.data,
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2response inside the fetchLessonsByModuleId"
    );
    return response.data.data;
  }
);

// !update lesson orders

export const updateLessonOrders = createAsyncThunk(
  "tenant/updateLessonOrders",
  async (lessons) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/lessons/update-order`,
      {
        lessons: lessons,
      }
    );
    console.log(response, "response inside the updateLessonOrders");
    return response.data.data;
  }
);

export const fetchInstructorsByCourseId = createAsyncThunk(
  "tenant/fetchInstructorsByCourseId",
  async (courseId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/instructors/${courseId}`
    );
    return response.data.data;
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    categories: [],
    subcategories: [],
    levels: [],
    languages: [],
    lessons: [],
    courseDetails: {},
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
    builder.addCase(fetchCourseBySearchValue.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(fetchSubcategories.fulfilled, (state, action) => {
      state.subcategories = action.payload;
    });
    builder.addCase(fetchLevels.fulfilled, (state, action) => {
      state.levels = action.payload;
    });
    builder.addCase(fetchLanguages.fulfilled, (state, action) => {
      state.languages = action.payload;
    });
    builder.addCase(createCourse.fulfilled, (state, action) => {
      state.courses.push(action.payload);
    });
    builder.addCase(createSubcategory.fulfilled, (state, action) => {
      state.subcategories.push(action.payload);
    });
    builder.addCase(fetchSubcategoriesByCategory.fulfilled, (state, action) => {
      state.subcategories = action.payload;
    });
    builder.addCase(searchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
    builder.addCase(fetchModulesByCourseId.fulfilled, (state, action) => {
      state.modules = action.payload;
    });
    builder.addCase(fetchLessonsByModuleId.fulfilled, (state, action) => {
      console.log(
        action.payload,
        "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2action.payload inside the fetchLessonsByModuleId"
      );
      state.lessons = action.payload;
    });
    builder.addCase(updateLessonOrders.fulfilled, (state, action) => {
      state.lessons = action.payload.lessons;
    });
    builder.addCase(fetchLessons.fulfilled, (state, action) => {
      state.lessons = action.payload;
    });
    builder.addCase(fetchCourseDetails.fulfilled, (state, action) => {
      state.courseDetails = action.payload;
    });
  },
});

export default courseSlice.reducer;
