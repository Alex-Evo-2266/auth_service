import React, {useState, useEffect, useContext, useCallback} from 'react'
import { useDispatch } from 'react-redux';
import { useAlert } from '../hooks/alert.hook';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTypeSelector } from "../hooks/useTypeSelector";
// import {Link} from 'react-router-dom'
import {methods, useHttp} from '../hooks/http.hook'
import { AlertType, AlertTypeAction } from '../store/reducers/alertReducer';

export const AuthtorizePage = function (){
	const dispatch = useDispatch()
	let navigate = useNavigate();
	const alert = useAlert()
	const {loading, request, error, clearError} = useHttp();
	const dataAuth = useTypeSelector(state=>state.auth)
	let [searchParams] = useSearchParams();
	console.log(searchParams, searchParams.get("g"))
	const [form, setForm] = useState({
		name: '', password: ''
	});

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const	oauth = useCallback(async(response_type:string, client_id:string, redirect_uri:string, scope:string, state:string)=>{
		const data = await request(`/api/auth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`, methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		console.log(data)
		window.location.replace(`${redirect_uri}?code=${data.code}&state=${state}`)
	},[request])

	useEffect(()=>{
		let response_type:string|null = searchParams.get("response_type")
		let client_id:string|null = searchParams.get("client_id")
		let redirect_uri:string|null = searchParams.get("redirect_uri")
		let scope:string|null = searchParams.get("scope")
		let state:string|null = searchParams.get("state")
		console.log(response_type, client_id, redirect_uri, scope, state)
		if (response_type && client_id && redirect_uri && scope && state)
		{
			if(dataAuth.isAuthenticated)
				oauth(response_type, client_id, redirect_uri, scope, state)
		}
		else
			alert.show(AlertType.ERROR, "error", "query error")
	},[dataAuth.isAuthenticated])

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const loginHandler = async (event:React.FormEvent) => {
		event.preventDefault();
		try {
			const data = await request('/api/auth/login', methods.POST, {...form})
			if(data)
			{
				dispatch({type: "LOGIN", payload:{id: data.userId, level: data.userLavel, token: data.token}})
				let response_type:string|null = searchParams.get("response_type")
				let client_id:string|null = searchParams.get("client_id")
				let redirect_uri:string|null = searchParams.get("redirect_uri")
				let scope:string|null = searchParams.get("scope")
				let state:string|null = searchParams.get("state")
				console.log(response_type, client_id, redirect_uri, scope, state)
				if (response_type && client_id && redirect_uri && scope && state)
				{
					if(dataAuth.isAuthenticated)
						oauth(response_type, client_id, redirect_uri, scope, state)
				}
				else
					alert.show(AlertType.ERROR, "error", "query error")
			}
		} catch (e) {
			console.error(e);
		}
	}

	const newpass = ()=>{
		console.log("not functional");
	}


	return(
	<div className="container-auth">
		<h1>Login</h1>
		<form onSubmit={loginHandler}>
			<div className="input-data txt_f">
				<input required type="text" name="name" value={form.name} onChange={changeHandler}/>
				<label>Name</label>
			</div>
			<div className="input-data txt_f">
				<input required type="password" name="password" value={form.password} onChange={changeHandler}/>
				<label>Password</label>
			</div>
			<div className='pass' onClick={newpass}>Forgot Password?</div>
			<input type="submit" value="Login"/>
		</form>
	</div>
	)
}