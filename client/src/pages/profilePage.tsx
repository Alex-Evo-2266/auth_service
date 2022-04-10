import React, { useCallback, useEffect, useState } from "react";
import { Menu } from "../components/menu";
import { methods, useHttp } from "../hooks/http.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { IAuthState } from "../interfaces/authInterfaces";

interface IUser{
	id: number | null
	name: string
	surname: string
	email: string
	level: number
	imageURL: string
}

export const ProfilePage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
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
			console.error(error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const getUser = useCallback(async () => {
		const data = await request("/api/user/get", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
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
	return(
		<>
			<Menu/>
			{
				(loading)?
				null:
				<div className="container">
					<div className="profile-container">
						<div className="profile">
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
							<button className="btn">edit</button>
						</div>
						<div className="services">

						</div>
					</div>
				</div>
			}
		</>
	)
}