import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Loading } from "../../components/loading";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState } from "../../interfaces/authInterfaces";
import { IOutUser, IUser } from "../../interfaces/profile";
import { AlertType, AlertTypeAction } from "../../store/reducers/alertReducer";

export const ProfileEditPage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const dispatch = useDispatch()
	const { request, error, clearError, loading } = useHttp()
	const [user, setUser] = useState<IUser>({
		id: null,
		name: '',
		surname: '',
		email: '',
		level: 0,
		imageURL: ''
	})

	useEffect(()=>{
		if (error)
			dispatch({type:AlertTypeAction.ALERT_SHOW, payload:{type:AlertType.ERROR, title: "fetch error", text:error}})
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const getUser = useCallback(async () => {
		const data = await request("/api/users", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		if (data)
			setUser({
				id: data.id,
				name: data.name,
				surname: data.surname,
				email: data.email,
				level: data.level,
				imageURL :data.imageURL || ""
			})
	},[request, dataAuth.token])

	useEffect(()=>{
		getUser()
	},[getUser])

	const changeHeandler = (event:React.ChangeEvent<HTMLInputElement>) =>{
		setUser((prev)=>({...prev, [event.target.name]:event.target.value}))
	}

	const save = async()=>{
		const data: IOutUser = {
			name: user.name,
			surname: user.surname,
			email: user.email
		}
		await request("/api/users", methods.PUT, data, {Authorization: `Bearer ${dataAuth.token}`})
	}

	if (loading)
		return (<Loading/>)

	return(
		<>
			<div className="img-container">
				<img src={user.imageURL} alt="avatar" />
			</div>
			<p className="separation">personal information</p>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="name" value={user.name} onChange={changeHeandler}/>
					<label>Name</label>
				</div>
			</div>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="surname" value={user.surname} onChange={changeHeandler}/>
					<label>Surname</label>
				</div>
			</div>
			<div className="input-container">
				<div className="input-data">
					<input required type="text" name="email" value={user.email} onChange={changeHeandler}/>
					<label>Email</label>
				</div>
			</div>
			<button onClick={save} className="btn">Save</button>
		</>
	)
}