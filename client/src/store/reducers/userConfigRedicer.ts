export enum UserConfigTypesActions {
	INSERT_USER_CONFIG = "INSERT_USER_CONFIG",
}

export enum BackgroundTypes {
	BASE = "BASE",
	MORNING = "MORNING",
	DAY = "DAY",
	EVENING = "EVENING",
	NIGHT = "NIGHT"
}

export interface IBackground{
	url: string
	type: BackgroundTypes
	title: string
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