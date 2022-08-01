import React from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";
import { AlertDialog } from "./alertDialog";
import { ConfirmationDialog } from "./confirmationDialog";
import { TextDialog } from "./textDialog";

export const DialogMessage:React.FC = () =>{
	const dialog = useTypeSelector(state=>state.dialog)
	const dispatch = useDispatch()

	if (!dialog.visible)
	return null
	
	return(
		<div className="dialog_wrapper">
			<div className="backdrop" onClick={()=>dispatch({type:DialogTypeAction.DIALOG_HIDE})}></div>
			{
				(dialog.type === DialogType.CONFIRMATION)?
				<ConfirmationDialog/>:
				(dialog.type === DialogType.TEXT)?
				<TextDialog/>:
				<AlertDialog/>
			}
		</div>
	)
}