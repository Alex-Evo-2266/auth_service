import React, { useEffect, useState } from "react";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { GrantType, ICreateService, IService, ResponseType } from "../../interfaces/services";
import { AlertType } from "../../store/reducers/alertReducer";
import { ServicePage } from "./service";

interface IProp{
	update?: ()=>void,
	hide?: ()=>void,
}

export const AddServicePage:React.FC<IProp> = (prop: IProp = {}) =>{
	const alert = useAlert()
	const { request, error, clearError } = useHttp()
	const dataAuth = useTypeSelector(state=>state.auth)
	const [newservice, setNewService] = useState<IService>(
		{
			title: "",
			client_id: "",
			grant_type: GrantType.AUTH_CODE,
			response_type: ResponseType.CODE,
			scopes: "",
			default_scopes: "",
			redirect_uris: "",
			default_redirect_uri: ""
		}
	)
	const [visible, setVisible] = useState<boolean>(false)
	const [service, setService] = useState<ICreateService>(
		{
			title: "",
			default_redirect_uri: ""
		})

	const changeHeandler = (event:React.ChangeEvent<HTMLInputElement>) =>{
		setService((prev:ICreateService)=>({...prev, [event.target.name]:event.target.value}))
	}

	const save = async()=>{
		if (service.title === "" || service.default_redirect_uri === "")
			return alert.show(AlertType.ERROR, "invalid data", "empty string")
		const data: IService = await request("/api/app/create", methods.POST, service, {Authorization: `Bearer ${dataAuth.token}`})
		console.log(data)
		if (data)
		{
			setNewService(data)
			setVisible(true)
		}
	}

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, alert])

	const hide = ()=>{
		if (prop.update)
			prop.update()
		if (prop.hide)
			prop.hide()
	}

	if (visible)
		return (
			<ServicePage data={newservice} hide={hide} update={prop.update}/>
		)

	return(
		<div className="add-service-containre">
			<h2>create service</h2>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="title" value={service.title} onChange={changeHeandler}/>
					<label>title</label>
				</div>
			</div>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="default_redirect_uri" value={service.default_redirect_uri} onChange={changeHeandler}/>
					<label>redirect url</label>
				</div>
			</div>
			<div className="btn_container">
				<button onClick={save} className="btn">Save</button>
				<button onClick={hide} className="btn">exit</button>
			</div>
		</div>
	)
}