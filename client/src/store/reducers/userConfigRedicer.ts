import { useBackgraund } from "../../hooks/background.hook"
import { IBackground } from "../../interfaces/ImageInterfaces"

export enum UserConfigTypesActions {
	INSERT_USER_CONFIG = "INSERT_USER_CONFIG",
}

export interface IUserConfigState{
	backgrounds: IBackground[]
}

interface IAction {
	type: UserConfigTypesActions
	payload:IUserConfigState
}

const initialSate:IUserConfigState = {
	backgrounds: []
}

export const userConfigReducer = (state:IUserConfigState = initialSate, action:IAction):IUserConfigState => {
	switch (action.type){
		case "INSERT_USER_CONFIG":
			return {...state, ...action.payload}
		default:
			return state
	}
}
