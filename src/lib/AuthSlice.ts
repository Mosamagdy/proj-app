import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface InitState {
  token: string | null;
  userData: { _id: string; photo: string; name: string } | null;
}


export const getUserData = createAsyncThunk("auth/getUserData", async () => {
  const token = localStorage.getItem("token"); 
  if (!token) throw new Error("Token not found in localStorage");

  const response = await axios.get("https://linked-posts.routemisr.com/users/profile-data", { headers: { token } });
  return response.data;
});

// const initialState: InitState = {
//   token:localStorage.getItem("token") || null, 
//   userData: null,
// };
const initialState: InitState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") || null : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
      localStorage.setItem("token", action.payload.token); 
    },
    logout: (state) => {
      state.token = null;
      state.userData = null;
      localStorage.removeItem("token"); 
    },
    addToken: (state, action) => {
      state.token = action.payload; 
      localStorage.setItem("token", action.payload); 
    },
    clearUserData: (state) => {
      state.token = null;
      state.userData = null;
      localStorage.removeItem("token"); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        console.log("User data fetched successfully:", action.payload);
        state.userData = action.payload?.user || null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        console.error("Error fetching user data:", action.error.message);
        state.userData = null;
      })
      .addCase(getUserData.pending, () => {
        console.log("Fetching user data...");
      });
  },
});

export const { login, logout, addToken, clearUserData } = authSlice.actions;
export default authSlice.reducer;