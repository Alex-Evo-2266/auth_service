import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useAlert } from '../hooks/alert.hook';
import {methods, useHttp} from '../hooks/http.hook'
import { useTypeSelector } from '../hooks/useTypeSelector';
import { IAuthState } from '../interfaces/authInterfaces';
import { AlertType } from '../store/reducers/alertReducer';

interface IRegister{
	email: string,
	name: string,
	password: string
}

interface IProp{
	hide?: ()=>void,
	updata?: ()=>void
}


export const AddPage = function (prop:IProp){
	const dispatch = useDispatch()
	const {show} = useAlert()
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const {request, error, clearError} = useHttp();
	const [regform, setregForm] = useState<IRegister>({
		name: '', password: '', email: ''
	});
	const [registrationPage, setRegistrationPage] = useState<boolean>(false)

	useEffect(()=>{
		if (error)
			show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, show])

	const changeRegHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setregForm({ ...regform, [event.target.name]: event.target.value })
	}

	const registerHandler = async (event:React.FormEvent) => {
		event.preventDefault();
		try {
			await request('/api/users/create', methods.POST, {...regform}, {Authorization: `Bearer ${dataAuth.token}`})
			if (prop.updata)
				prop.updata()
			if (prop.hide)
				prop.hide()
		} catch (e) {
			console.error(e);
		}
	}

	return(
	<div className="container-auth">
		<div className="auth-switch">
			<h2 className={`active`} onClick={()=>setRegistrationPage(true)}>Registration</h2>
		</div>
		<div className="auth-content">
		<form className={`show`} onSubmit={registerHandler}>
			<div className="input-data txt_f">
				<input required type="text" name="name" value={regform.name} onChange={changeRegHandler}/>
				<label style={{color: "#a6a6a6"}}>Name</label>
			</div>
			<div className="input-data txt_f">
				<input required type="text" name="email" value={regform.email} onChange={changeRegHandler}/>
				<label style={{color: "#a6a6a6"}}>Email</label>
			</div>
			<div className="input-data txt_f">
				<input required type="password" name="password" value={regform.password} onChange={changeRegHandler}/>
				<label style={{color: "#a6a6a6"}}>Password</label>
			</div>
			<input type="submit" value="Create"/>
		</form>
		</div>
	</div>
	)
}
