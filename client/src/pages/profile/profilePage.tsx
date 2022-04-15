import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState } from "../../interfaces/authInterfaces";
import { IUser } from "../../interfaces/profile";
import { AlertType, AlertTypeAction } from "../../store/reducers/alertReducer";

export const ProfilePage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const { request, error, clearError, loading } = useHttp()
	const alert = useAlert()
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
			alert.show(AlertType.ERROR, "fetch error", error)
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

	if (loading)
		return <Loading/>
	
	return(
		<>
			<div className="img-container">
				<img src={user.imageURL} alt="avatar" />
			</div>
			<p className="separation">personal information</p>
			<div className="text-container">
				<span className="text">Name:</span>
				<span className="text">{user.name}</span>
			</div>
			<div className="text-container">
				<span className="text">Surname:</span>
				<span className="text">{user.surname}</span>
			</div>
			<div className="text-container">
				<span className="text">Email:</span>
				<span className="text">{user.email}</span>
			</div>
			<div className="separation"></div>
			<Link to="/profile/edit" className="btn">edit</Link>
		</>
	)
}