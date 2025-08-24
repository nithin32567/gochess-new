



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchUser = createAsyncThunk("user/getUser", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/getcurrentuser/me`, {
    withCredentials: true,
  })
  return response.data
});

export const updateUser = createAsyncThunk(
  "tenant/updateUser",
  async (user) => {
    console.log(user, "users inside the updateUser");
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/${user.user_id}`,
      user
    );
    return response.data.data;
  }
);


export const getCurrentUser = createAsyncThunk("user/getCurrentUser", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/getcurrentuser/me`, {
    withCredentials: true,
  })
  return response.data
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, ((state, action) => {
      // console.log(action.payload)
      state.user = action.payload
    }))
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // After successful update, we'll refetch the data
      // The component will handle the refetch
      state.user = action.payload
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.user
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    });
  }
})

export default userSlice.reducer;