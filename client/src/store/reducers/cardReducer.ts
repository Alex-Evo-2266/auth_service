export enum CardTypeAction {
	CARD_SHOW = "CARD_SHOW",
	CARD_HIDE = "CARD_HIDE"
}

export interface ICardData{
	content:React.FC | null
}

interface IItem{
	title: string
	data: any
}

interface ICardState{
	content:React.FC | null
	visible: boolean
}

interface IAction {
	type: CardTypeAction
	payload:ICardData
}

const initialSate:ICardState = {
	content: null,
	visible: false
}

export const cardReducer = (state:ICardState = initialSate, action:IAction):ICardState => {
	switch (action.type){
		case CardTypeAction.CARD_SHOW:
			return {...state, ...action.payload, visible: true}
		case CardTypeAction.CARD_HIDE:
			return {...state, visible: false}
		default:
			return state
	}
}