import { combineReducers } from "redux";
import loginSliceReducer from "../features/login/LoginSlice";

export default combineReducers({
  loginSlice: loginSliceReducer,
});
