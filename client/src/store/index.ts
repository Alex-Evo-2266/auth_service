import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { alertReducer } from "./reducers/alertReducer";
import { authReducer } from "./reducers/authReducer";
import { dialogReducer } from "./reducers/dialogReducer";
import { menuReducer } from "./reducers/menuReducer";

const rootReduser = combineReducers({
	auth: authReducer,
	menu: menuReducer,
	alert: alertReducer,
	dialog: dialogReducer
})

export type RootState = ReturnType<typeof rootReduser>


export const store = createStore(rootReduser, applyMiddleware(thunk))