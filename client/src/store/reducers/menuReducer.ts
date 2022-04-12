export enum MenuTypesActions {
	MENU_SET_NAME = "MENU_SET_NAME",
}

interface IPayload{
	title?: string
}

export interface IMenuState{
	title: string
}

interface IAction {
	type: MenuTypesActions
	payload:IPayload
}

const initialSate:IMenuState = {
	title: ""
}

export const menuReducer = (state:IMenuState = initialSate, action:IAction):IMenuState => {
	switch (action.type){
		case "MENU_SET_NAME":
			return {...state, title: action.payload.title || ""}
		default:
			return state
	}
}