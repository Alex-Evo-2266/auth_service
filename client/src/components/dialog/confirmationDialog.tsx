import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { DialogTypeAction } from "../../store/reducers/dialogReducer";

export const ConfirmationDialog:React.FC = () =>{
	const dialog = useTypeSelector(state=>state.dialog)
	const dispatch = useDispatch()
	const [field, setField] = useState<any>("")
	const [fieldid, setFieldid] = useState<number | null>(null)

	const change = (id: number, item: any)=>{
		setFieldid(id)
		setField(item)
	}	

	const click = ()=>{
		if (typeof(dialog.callback) === "function")
			dialog.callback(field)
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
			<div className="content content-scrollable">
				<div className="container-list">
					{
						dialog.items?.map((item, index)=>(
							<div key={index} className={`field ${(fieldid === index)?"active":""}`}>
								<div className="radio-btn">
									<input type="radio" name="dialog" id={`dialog-${index}`} onClick={()=>change(index, item)}/>
									<div className="radio-background">
										<div className="radio-outer-circle"></div>
										<div className="radio-inner-circle"></div>
									</div>
									<div className="radio-ripple"></div>
								</div>
								<label htmlFor={`dialog-${index}`}>{item.title}</label>
							</div>
						))
					}
				</div>
			</div>
			<div className="dialog_btn_container">
				<button className="btn" onClick={cancel}>cancel</button>
				<button className="btn" onClick={click}>ok</button>
			</div>
		</div>
	)
}