import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useAlert } from '../hooks/alert.hook';
// import {Link} from 'react-router-dom'
import {methods, useHttp} from '../hooks/http.hook'
import { AlertType } from '../store/reducers/alertReducer';

interface ILogin{
	name: string,
	password: string
}

interface IRegister{
	email: string,
	name: string,
	password: string
}

export const AuthPage = function (){
	const dispatch = useDispatch()
	const {show} = useAlert()
	const {request, error, clearError} = useHttp();
	const [form, setForm] = useState<ILogin>({
		name: '', password: ''
	});
	const [regform, setregForm] = useState<IRegister>({
		name: '', password: '', email: ''
	});
	const [registrationPage, setRegistrationPage] = useState<boolean>(false)

	// const registerPermission = !!(process.env.REACT_APP_REGISTER_USER?.toLowerCase() === "true")
	const registerPermission = false

	useEffect(()=>{
		if (error)
			show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, show])

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const changeRegHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setregForm({ ...regform, [event.target.name]: event.target.value })
	}

	const loginHandler = async (event:React.FormEvent) => {
		event.preventDefault();
		try {
			const data = await request('/api/auth/login', methods.POST, {...form})
			if(data)
				dispatch({type: "LOGIN", payload:{id: data.userId, level: data.userLevel, token: data.token}})
		} catch (e) {
			console.error(e);
		}
	}

	const registerHandler = async (event:React.FormEvent) => {
		event.preventDefault();
		try {
			await request('/api/users/create', methods.POST, {...regform})
		} catch (e) {
			console.error(e);
		}
	}

	const newpass = ()=>{
		console.log("not functional");
	}

	return(
	<div className="container-auth">
		<div className="auth-switch">
			<h2 className={`${(!registrationPage)?"active":""}`} onClick={()=>setRegistrationPage(false)}>Login</h2>
			{
				(registerPermission)?<h2 className={`${(registrationPage)?"active":""}`} onClick={()=>setRegistrationPage(true)}>Registration</h2>:null
			}
		</div>
		<div className="auth-content">
		<form className={`${(!registrationPage)?"show":""}`} onSubmit={loginHandler}>
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
		{(registerPermission)?
		<form className={`${(registrationPage)?"show":""}`} onSubmit={registerHandler}>
			<div className="input-data txt_f">
				<input required type="text" name="name" value={regform.name} onChange={changeRegHandler}/>
				<label>Name</label>
			</div>
			<div className="input-data txt_f">
				<input required type="text" name="email" value={regform.email} onChange={changeRegHandler}/>
				<label>Email</label>
			</div>
			<div className="input-data txt_f">
				<input required type="password" name="password" value={regform.password} onChange={changeRegHandler}/>
				<label>Password</label>
			</div>
			<input type="submit" value="Register"/>
		</form>:
		null}
		</div>
	</div>
	)
}
