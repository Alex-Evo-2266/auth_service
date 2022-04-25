import { useBackgraund } from "../../hooks/background.hook"
import { IBackground } from "../../interfaces/ImageInterfaces"
import { colors, IColors, night_colors } from "../../interfaces/colorInterfaces";

export enum UserConfigTypesActions {
	INSERT_USER_CONFIG = "INSERT_USER_CONFIG",
}

export interface IUserConfigState{
	backgrounds: IBackground[]
	colors: IColors
	night_colors: IColors
}

interface IAction {
	type: UserConfigTypesActions
	payload:IUserConfigState
}

const initialSate:IUserConfigState = {
	backgrounds: [],
	colors: colors,
	night_colors: night_colors
}

export const userConfigReducer = (state:IUserConfigState = initialSate, action:IAction):IUserConfigState => {
	switch (action.type){
		case "INSERT_USER_CONFIG":
			return {...state, ...action.payload}
		default:
			return state
	}
}
