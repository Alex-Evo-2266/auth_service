export enum MenuTypesActions {
	MENU_SET_NAME = "MENU_SET_NAME",
	MENU_SHOW = "MENU_SHOW",
	MENU_HIDE = "MENU_HIDE",
	MENU_TOGLE = "MENU_TOGLE"
}

interface IPayload{
	title?: string
}

export interface IMenuState{
	title: string
	visible: boolean
}

interface IAction {
	type: MenuTypesActions
	payload:IPayload
}

const initialSate:IMenuState = {
	title: "",
	visible: false
}

export const menuReducer = (state:IMenuState = initialSate, action:IAction):IMenuState => {
	switch (action.type){
		case "MENU_SET_NAME":
			return {...state, title: action.payload.title || ""}
		case "MENU_SHOW":
			return {...state, visible: true}
		case "MENU_HIDE":
			return {...state, visible: false}
		case "MENU_TOGLE":
			return {...state, visible: !state.visible}
		default:
			return state
	}
}