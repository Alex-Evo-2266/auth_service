import React, {useState, useEffect, useContext} from 'react'
import { useDispatch } from 'react-redux';
import { useAlert } from '../hooks/alert.hook';
// import {Link} from 'react-router-dom'
import {methods, useHttp} from '../hooks/http.hook'
import { AlertType, AlertTypeAction } from '../store/reducers/alertReducer';

export const AuthPage = function (){
	const dispatch = useDispatch()
	const alert = useAlert()
	const {loading, request, error, clearError} = useHttp();
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

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const loginHandler = async (event:React.FormEvent) => {
		event.preventDefault();
		try {
			const data = await request('/api/auth/login', methods.POST, {...form})
			if(data)
				dispatch({type: "LOGIN", payload:{id: data.userId, level: data.userLavel, token: data.token}})
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
			<div className='pass'>Forgot Password?</div>
			<input type="submit" value="Login"/>
		</form>
	</div>
	)
}
