import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { AlertTypeAction } from "../store/reducers/alertReducer";

export const Alert:React.FC = () =>{
	const alert = useTypeSelector(state => state.alert)
	const dispatch = useDispatch()
	const [clousing, setclousing] = useState<string>("")

	const typs = {
		INFO: "alert_info",
		ERROR: "alert_error",
		WARNING: "alert_warning",
		SUCCESS: "alert_success"
	}

	const icons = {
		INFO: "fas fa-info-circle",
		ERROR: "fas fa-bomb",
		WARNING: "fas fa-exclamation-triangle",
		SUCCESS: "fas fa-check-circle"
	}

	const titles = {
		INFO: "Info",
		ERROR: "Error",
		WARNING: "Warning",
		SUCCESS: "Success"
	}

	const close = ()=>{
		setclousing("closeing")
		setTimeout(()=>{
			dispatch({type: AlertTypeAction.ALERT_HIDE})
			setclousing("")
		},350)
	}

	if(!alert.visible)
		return null;

	return(
		<div className="alert_wrapper">
			<div className="alert_inner">
				<div className={`alert_item ${typs[alert.type]} ${clousing}`}>
					<div className="icon data_icon">
						<i className={icons[alert.type]}></i>
					</div>
					<div className="data">
						<p className="title"><span>{titles[alert.type]}: </span>{alert.title}</p>
						<p className="sub">{alert.text}</p>
					</div>
					<div className="icon close" onClick={close}>
						<i className="fas fa-times"></i>
					</div>
				</div>
			</div>
		</div>
	)
}