export enum DialogType {
	ALERT = "ALERT",
	TEXT = "TEXT",
	CONFIRMATION = "CONFIRMATION"
}

export enum DialogTypeAction {
	DIALOG_SHOW = "DIALOG_SHOW",
	DIALOG_HIDE = "DIALOG_HIDE"
}

export interface IDialogData{
	type: DialogType
	title: string
	text?: string
	callback?: (data: any)=>void
	cancel?: ()=>void
	items?: any[]
}

interface IItem{
	title: string
	data: any
}

interface IDialogState{
	type: DialogType
	title: string
	text?: string
	callback?: (data: any)=>void
	cancel?: ()=>void
	items?: IItem[]
	visible: boolean
}

interface IAction {
	type: DialogTypeAction
	payload:IDialogData
}

const initialSate:IDialogState = {
	type: DialogType.ALERT,
	title: "",
	visible: false,
	text: ""
}

export const dialogReducer = (state:IDialogState = initialSate, action:IAction):IDialogState => {
	switch (action.type){
		case DialogTypeAction.DIALOG_SHOW:
			return {...state, ...action.payload, visible: true}
		case DialogTypeAction.DIALOG_HIDE:
			return {...state, visible: false}
		default:
			return state
	}
}