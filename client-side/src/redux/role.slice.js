import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    roles: JSON.parse(localStorage.getItem("roles")) || [],
    loading: false,
    error: null,
}

export const fetchRoles = createAsyncThunk("role/fetchRoles", async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
        withCredentials: true
    });
    console.log(response.data, "response.data")
    return response.data;
})

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRoles.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchRoles.fulfilled, (state, action) => {
            state.loading = false;
            state.roles = action.payload.data;
            localStorage.setItem("roles", JSON.stringify(action.payload.data));
        })
        builder.addCase(fetchRoles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { } = roleSlice.actions;
export default roleSlice.reducer;