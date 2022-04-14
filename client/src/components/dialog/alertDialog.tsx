import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

export const AlertDialog:React.FC = () =>{
	const dialog = useTypeSelector(state=>state.dialog)
	const dispatch = useDispatch()
	const [text, setText] = useState<string>("")

	const change = (event:React.ChangeEvent<HTMLInputElement>)=>{
		setText(event.target.value)
	}

	const click = ()=>{
		if (typeof(dialog.callback) === "function")
			dialog.callback(text)
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
				<button className="btn min" onClick={cancel}>cancel</button>
				<button className="btn min" onClick={click}>ok</button>
			</div>
		</div>
	)
}