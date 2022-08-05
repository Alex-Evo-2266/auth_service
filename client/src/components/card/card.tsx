import React from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { CardTypeAction } from "../../store/reducers/cardReducer";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

export const Card:React.FC = () =>{
	const card = useTypeSelector(state=>state.card)
	const dispatch = useDispatch()

	if (!card.visible)
	return null
	
	return(
		<div className="dialog_wrapper" style={{zIndex: 998}}>
			<div className="backdrop" onClick={()=>dispatch({type:CardTypeAction.CARD_HIDE})}></div>
			{card.content}
		</div>
	)
}