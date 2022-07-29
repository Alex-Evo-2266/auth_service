import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loading } from "../../components/loading";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState } from "../../interfaces/authInterfaces";
import { IUser } from "../../interfaces/profile";
import { IService } from "../../interfaces/services";
import { AlertType, AlertTypeAction } from "../../store/reducers/alertReducer";
import { AddServicePage } from "./newServices";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

interface IProp{
	data: IService,
	hide?: ()=>void,
	update?: ()=>void
}

export const ServicePage:React.FC<IProp> = (props: IProp) =>{
	const alert = useAlert()
	const dispatch = useDispatch()
	const dataAuth = useTypeSelector(state=>state.auth)
	const { request, error, clearError, loading } = useHttp()
	const [service, setService] = useState<IService>(props.data)

	const hidef = ()=>{
		if (props.hide)
			props.hide()
	}

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const del = async()=>{
		dispatch({type:DialogTypeAction.DIALOG_SHOW, payload:{type:DialogType.ALERT, title:"delete?", text:"delete client app", callback:async()=>{
			const data = await request(`/api/app/${props.data.client_id}`, methods.DELETE, null, {Authorization: `Bearer ${dataAuth.token}`})
			if (!data)
				return 
			if (props.update)
				props.update()
			hidef()
		}}})
	}

	const changeHeandler = (event:React.ChangeEvent<HTMLInputElement>) =>{
		setService((prev:IService)=>({...prev, [event.target.name]:event.target.value}))
	}

	const save = async()=>{
		if (service.title == "" || service.default_redirect_uri == "")
			return alert.show(AlertType.ERROR, "invalid data", "empty string")
		const data = await request("/api/app", methods.PUT, service, {Authorization: `Bearer ${dataAuth.token}`})
		if (!data)
			return
		if (props.update)
			props.update()
		alert.show(AlertType.SUCCESS, "success", "edit service success")
		hidef()
	}

	return(
		<div className="add-service-containre">
			<h2>create service</h2>
			<p className="separation"></p>
			<h4>title</h4>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="title" value={service.title} onChange={changeHeandler}/>
					<label>title</label>
				</div>
			</div>
			<h4>id</h4>
			<div className="input-container">
				<div className="input-data">
					<p>{props.data.client_id}</p>
				</div>
			</div>
			{
				(props.data.client_secret)?
				<>
				<h4>secret</h4>
				<div className="input-container">
					<div className="input-data">
						<p>{props.data.client_secret}</p>
					</div>
				</div>
				</>:null
			}
			<h4>redirect uri</h4>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="default_redirect_uri" value={service.default_redirect_uri} onChange={changeHeandler}/>
					<label>redirect url</label>
				</div>
			</div>
			<div className="btn_container">
				<button onClick={save} className="btn">save</button>
				<button onClick={del} style={{background: "#cb2020"}} className="btn">delete</button>
				<button onClick={hidef} className="btn">exit</button>
			</div>
		</div>
	)
}