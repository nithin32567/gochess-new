import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to fetch tenants
export const fetchTenantsWithCourseCountandUserCount = createAsyncThunk(
  "superAdmin/fetchTenants",
  async () => {
    console.log("fetching tenants");
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/superadmin/tenants/course-count-and-user-count`,
      {
        withCredentials: true,
      }
    );
    console.log("response", response.data);
    return response.data.tenants;
  }
);

// ! this is used to get the courses by tenant

export const fetchCoursesByTenant = createAsyncThunk(
  "superAdmin/fetchCoursesByTenant",
  async (tenantId) => {
    console.log("tenantId in the sice", tenantId);
    if (!tenantId) {
      return [];
    }
    console.log("tenantId inside the slice", tenantId);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/superadmin/courses/tenant/${tenantId}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  }
);

export const addTenant = createAsyncThunk(
  "superAdmin/addTenant",
  async (tenant) => {
    console.log(tenant, "tenant in the slice");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/superadmin/tenant/create-tenant`,
      tenant,
      {
        withCredentials: true,
      }
    );
    console.log(response, "response in the slice");
    return response.data.data;
  }
);

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    tenantDetails: [],
    coursesByTenant: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchTenantsWithCourseCountandUserCount.fulfilled,
      (state, action) => {
        state.tenantDetails = action.payload;
      }
    );
    builder.addCase(fetchCoursesByTenant.fulfilled, (state, action) => {
      state.coursesByTenant = action.payload;
    });
    builder.addCase(fetchCoursesByTenant.rejected, (state) => {
      state.coursesByTenant = [];
    });
  },
});

export default superAdminSlice.reducer;
