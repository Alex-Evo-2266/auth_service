import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState } from "../../interfaces/authInterfaces";
import { IUser } from "../../interfaces/profile";
import { IService } from "../../interfaces/services";
import { AlertType, AlertTypeAction } from "../../store/reducers/alertReducer";

export const ServicesPage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const { request, error, clearError, loading } = useHttp()
	const alert = useAlert()
	const [services, setServices] = useState<IService[]>([])

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const getUser = useCallback(async () => {
		const data = await request("/api/app", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		if (data)
			setServices(data)
	},[request, dataAuth.token])

	useEffect(()=>{
		getUser()
	},[getUser])

	if (loading)
		return <Loading/>
	
	return(
		<>
		<div className="services-list">

		</div>
		<div className="floating-btn">+</div>
		</>
	)
}