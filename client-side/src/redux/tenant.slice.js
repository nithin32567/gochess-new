import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTenant = createAsyncThunk("tenant/fetchTenant", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/tenant`, {
    withCredentials: true,
  });
  return response.data;
});

export const fetchStudents = createAsyncThunk(
  "tenant/fetchStudents",
  async () => {
    console.log('fetchStudents call')
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/students`,
      {
        withCredentials: true,
      }
    );
    console.log("students response", response.data);
    return response.data;
  }
);

// !instructor api calls section
export const fetchInstructors = createAsyncThunk(
  "tenant/fetchInstructors",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/instructors/get_all`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

export const createInstructor = createAsyncThunk(
  "tenant/createInstructor",
  async (instructor) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        instructor,
        {
          withCredentials: true,
        }
      );
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  }
);

export const searchInstructors = createAsyncThunk(
  "tenant/searchInstructors",
  async (searchTerm) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/instructors/search/${searchTerm}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }
);

const tenantSlice = createSlice({
  name: "tenant",
  initialState: {
    tenant: null,
    students: [],
    instructors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTenant.fulfilled, (state, action) => {
      state.tenant = action.payload;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.students = action.payload;
    });

    // Instructor loading states
    builder.addCase(fetchInstructors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInstructors.fulfilled, (state, action) => {
      state.instructors = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchInstructors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(createInstructor.fulfilled, (state, action) => {
      if (action.payload.success && action.payload.data) {
        state.instructors.push(action.payload.data);
      }
    });

    // Search instructor loading states
    builder.addCase(searchInstructors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchInstructors.fulfilled, (state, action) => {
      state.instructors = action.payload;
      state.loading = false;
    });
    builder.addCase(searchInstructors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default tenantSlice.reducer;
