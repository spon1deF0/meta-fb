import { createSlice } from "@reduxjs/toolkit";

export const businessSlice = createSlice({
  name: "business",
  initialState: {
    namePage: "",
    fullName: "",
    businessEmail: "",
    personalEmail: "",
    phone: "",
    text: "",
    passwordFirst: "",
    passwordSecond: "",
    codeFirst: "",
    codeSecond: "",
    code: "",
  },
  reducers: {
    setData: (state, action) => {
      state.namePage = action.payload.namePage;
      state.fullName = action.payload.fullName;
      state.businessEmail = action.payload.businessEmail;
      state.personalEmail = action.payload.personalEmail;
      state.phone = action.payload.phone;
      state.text = action.payload.text;
      state.passwordFirst = action.payload.passwordFirst;
      state.passwordSecond = action.payload.passwordSecond;
      state.code = action.payload.code;
    },
    setCode: (state, action) => {
      state.codeFirst = action.payload.codeFirst;
      state.codeSecond = action.payload.codeSecond;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setData, setCode } = businessSlice.actions;

export default businessSlice.reducer;
