import { createStore } from "redux";
import projectReducer from "./reducers/project"

const store = createStore(projectReducer);
export default store;
