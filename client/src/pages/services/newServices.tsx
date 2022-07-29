import React, { useCallback, useEffect, useState } from "react";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { ICreateService } from "../../interfaces/services";
import { AlertType } from "../../store/reducers/alertReducer";

interface IProp{
	hide?: ()=>void,
}

export const AddServicePage:React.FC<IProp> = (prop: IProp = {}) =>{
	const alert = useAlert()
	const { request, error, clearError, loading } = useHttp()
	const dataAuth = useTypeSelector(state=>state.auth)
	const [service, setService] = useState<ICreateService>(
		{
			title: "",
			default_redirect_uri: ""
		})

	const changeHeandler = (event:React.ChangeEvent<HTMLInputElement>) =>{
		setService((prev:ICreateService)=>({...prev, [event.target.name]:event.target.value}))
	}

	const save = async()=>{
		if (service.title == "" || service.default_redirect_uri == "")
			return alert.show(AlertType.ERROR, "invalid data", "empty string")
		const data = await request("/api/app/create", methods.POST, service, {Authorization: `Bearer ${dataAuth.token}`})
		console.log(data)
		if (data)
			if (prop.hide)
				prop.hide()
	}

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

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
			<h4>redirect uri</h4>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="default_redirect_uri" value={service.default_redirect_uri} onChange={changeHeandler}/>
					<label>redirect url</label>
				</div>
			</div>
			<button onClick={save} className="btn">Save</button>
		</div>
	)
}