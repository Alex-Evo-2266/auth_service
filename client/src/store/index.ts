import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { alertReducer } from "./reducers/alertReducer";
import { authReducer } from "./reducers/authReducer";
import { cardReducer } from "./reducers/cardReducer";
import { dialogReducer } from "./reducers/dialogReducer";
import { menuReducer } from "./reducers/menuReducer";
import { userConfigReducer } from "./reducers/userConfigRedicer";

const rootReduser = combineReducers({
	auth: authReducer,
	menu: menuReducer,
	alert: alertReducer,
	dialog: dialogReducer,
	card: cardReducer,
	userConfig: userConfigReducer
})

export type RootState = ReturnType<typeof rootReduser>


export const store = createStore(rootReduser, applyMiddleware(thunk))