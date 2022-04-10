import React, {useState, useEffect, useContext} from 'react'
import { useDispatch } from 'react-redux';
// import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'

export const AuthPage = function (){
	const dispatch = useDispatch()
	const {loading, request, error, clearError} = useHttp();
	const [form, setForm] = useState({
		name: '', password: ''
	});

	useEffect(()=>{
		if (error)
			console.error(error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const loginHandler = async () => {
		try {
			const data = await request('/auth_api/login', 'POST', {...form})
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
	<div className="row">
		<div className="title">
			<h1>Sing In Form</h1>
		</div>
		<div className="container-auth">
			<div className="left-auth"></div>
			<div className="right-auth">
				<div className={`formBox-auth`}>
					<p>Name</p>
					<input placeholder="Login" id="name" type="text" name="name" value={form.name} onChange={changeHandler} required/>
					<p>Password</p>
					<input placeholder="•••••••" id="password" type="password" name="password" value={form.password} onChange={changeHandler} required/>
					<input type="submit" onClick={loginHandler} disabled={loading} value="Sign In"/>
					<p onClick={newpass} style={{marginTop:"5px"}} className="liteButton">забыли пароль?</p>
				</div>
			</div>
		</div>
	</div>
	)
}
