import React from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

export const AlertDialog:React.FC = () =>{
	const dialog = useTypeSelector(state=>state.dialog)
	const dispatch = useDispatch()

	const click = ()=>{
		if (typeof(dialog.callback) === "function")
			dialog.callback(null)
		dispatch({type:DialogTypeAction.DIALOG_HIDE})
	}

	const cancel = ()=>{
		if (typeof(dialog.cancel) === "function")
			dialog.cancel()
		dispatch({type:DialogTypeAction.DIALOG_HIDE})
	}
	
	return (
		<div className="dialog_item">
			<h2 className="dialog_title">{dialog.title}</h2>
			<div className="content">
				<div className="text">{dialog.text}</div>
			</div>
			<div className="dialog_btn_container">
				<button className="btn" onClick={cancel}>cancel</button>
				<button className="btn" onClick={click}>ok</button>
			</div>
		</div>
	)
}