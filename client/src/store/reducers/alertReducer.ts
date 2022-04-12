export enum AlertType {
	INFO = "INFO",
	ERROR = "ERROR",
	WARNING = "WARNING",
	SUCCESS = "SUCCESS"
}

export enum AlertTypeAction {
	ALERT_SHOW = "ALERT_SHOW",
	ALERT_HIDE = "ALERT_HIDE"
}

export interface IAlertData{
	type: AlertType
	title: string
	text: string
}

interface IAlertState{
	type: AlertType
	visible: boolean
	title: string
	text: string
}

interface IAction {
	type: AlertTypeAction
	payload:IAlertData
}

const initialSate:IAlertState = {
	type: AlertType.INFO,
	title: "",
	visible: false,
	text: ""
}

export const alertReducer = (state:IAlertState = initialSate, action:IAction):IAlertState => {
	switch (action.type){
		case AlertTypeAction.ALERT_SHOW:
			return {...state, title: action.payload.title, type: action.payload.type, text: action.payload.text, visible: true}
		case AlertTypeAction.ALERT_HIDE:
			return {...state, visible: false}
		default:
			return state
	}
}