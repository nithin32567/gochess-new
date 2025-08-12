import { configureStore } from "@reduxjs/toolkit";
import superAdminReducer from "./super.admin.slice";
import loadingReducer from "./loading.slice";
import userReducer from "./user.slice";
import tenantReducer from "./tenant.slice";
import courseReducer from "./course.slice";
const store = configureStore({
  reducer: {
    superAdmin: superAdminReducer,
    loading: loadingReducer,
    user: userReducer,
    tenant: tenantReducer,
    course: courseReducer,
  },
});

export default store;
