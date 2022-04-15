import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Alert } from "../components/alert";
import { DialogMessage } from "../components/dialog/dialog";
import { Menu } from "../components/menu";
import { useAlert } from "../hooks/alert.hook";
import { methods, useHttp } from "../hooks/http.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { AlertType, AlertTypeAction } from "../store/reducers/alertReducer";
import { UserConfigTypesActions } from "../store/reducers/userConfigRedicer";

export const RootComponents:React.FC = () =>{
	const {request, error, clearError} = useHttp()
	const dataAuth = useTypeSelector(state => state.auth)
	const dispatch = useDispatch()
	const alert = useAlert()
	const dataConfig = useTypeSelector(state => state.userConfig)

	const getData = useCallback(async()=>{
		const data = await request("/api/config", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		dispatch({type:UserConfigTypesActions.INSERT_USER_CONFIG, payload:data})
	},[])

	useEffect(()=>{
		if (!error) return ;
			alert.show(AlertType.ERROR, "fetch error", error)
		return ()=>{
			clearError();
		}
	},[error, clearError])

	useEffect(()=>{
		getData()
	},[getData])

	useEffect(()=>{
		console.log(dataConfig)
	},[dataConfig])

	return(
		<>
			<Menu/>
			<Alert/>
			<DialogMessage/>
			<main className="root-container">
				<Outlet/>
			</main>
		</>
	)
}