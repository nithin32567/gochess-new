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
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/tenant/students`,
      {
        withCredentials: true,
      }
    );
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
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users`,
      instructor,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response inside the createInstructor");
    return response.data.data;
  }
);

const tenantSlice = createSlice({
  name: "tenant",
  initialState: {
    tenant: null,
    students: [],
    instructors: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTenant.fulfilled, (state, action) => {
      state.tenant = action.payload;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.students = action.payload;
    });

    builder.addCase(fetchInstructors.fulfilled, (state, action) => {
      state.instructors = action.payload;
    });
    builder.addCase(createInstructor.fulfilled, (state, action) => {
      state.instructors.push(action.payload);
    });
  },
});

export default tenantSlice.reducer;
