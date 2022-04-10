import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./reducers/authReducer";

const rootReduser = combineReducers({
	auth: authReducer
})

export type RootState = ReturnType<typeof rootReduser>


export const store = createStore(rootReduser, applyMiddleware(thunk))