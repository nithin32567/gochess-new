import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/getcurrentuser/me`
    );
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
