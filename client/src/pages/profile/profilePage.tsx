import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState, ISession, INewPass } from "../../interfaces/authInterfaces";
import { IUser } from "../../interfaces/profile";
import { AlertType } from "../../store/reducers/alertReducer";
import { CardTypeAction } from "../../store/reducers/cardReducer";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

const CardEditPass:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const dispatch = useDispatch()
	const { request, error, clearError, loading } = useHttp()
	const alert = useAlert()
	const [password, setPassword] = useState<INewPass>({
		old_password:"",
		new_password:""
	})

	const changeRegHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword({ ...password, [event.target.name]: event.target.value })
	}

	const exit = ()=>{
		dispatch({type:CardTypeAction.CARD_HIDE})
	}

	const new_password = async()=>{
		await request(`/api/users/newpass`, methods.POST, password, {Authorization: `Bearer ${dataAuth.token}`})
		exit()
	}

	return (
		<div className="card">
			<h2 className="header">Edit password</h2>
			<div className="content ">
					<div className="input-container">
						<div className="input-data" style={{marginBottom: "10px"}}>
							<input required type="password" name="old_password" value={password.old_password} onChange={changeRegHandler}/>
							<label>old password</label>
						</div>
					</div>
					<div className="input-container">
						<div className="input-data">
							<input required type="password" name="new_password" value={password.new_password} onChange={changeRegHandler}/>
							<label>new password</label>
						</div>
					</div>
				</div>
			<div className="card_btn_container">
				<button className="btn" onClick={exit}>exit</button>
				<button className="btn" onClick={new_password}>send</button>
			</div>
		</div>
	)
}

const CardSession:React.FC = () => {
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const dispatch = useDispatch()
	const { request, error, clearError, loading } = useHttp()
	const alert = useAlert()
	const [session, setSession] = useState<ISession[]>([])

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, alert])

	const getSession = useCallback(async ()=>{
		const data = await request("/api/auth/session", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		if (data && Array.isArray(data))
			setSession(
				data.map((item)=>({
					id: item.id,
					client_name: item.client_name,
					entry_time: new Date(item.entry_time),
					host: item.host,
					platform: item.platform
				}))
			)
	},[request, dataAuth.token])

	useEffect(()=>{
		getSession()
	},[getSession])

	const exit = ()=>{
		dispatch({type:CardTypeAction.CARD_HIDE})
	}

	const del = (id:number)=>{
		dispatch({type: DialogTypeAction.DIALOG_SHOW, payload:{type:DialogType.ALERT, title:"delete?", text:"close session?", callback:async ()=>{
			await request(`/api/auth/session/${id}`, methods.DELETE, null, {Authorization: `Bearer ${dataAuth.token}`})
			getSession()
		}}})
		console.log(id)
	}

	return (
		<div className="card">
			<h2 className="header">dv</h2>
			<div className="content content-scrollable">
					{
						(session.length != 0)?
						session.map((item, index)=>{
							return (
								<div key={index} className="field field-with-button">
									<div className="content-field">
									service: {item.client_name}; pltform: {item.platform}; date: {item.entry_time.toString()}
									</div>
									<div onClick={()=>del(item.id)} className="field-btn" style={{color:"#dd0000"}}>x</div>
								</div>
							)
						}):
						<div className="field field-with-button">
							<div className="content-field">
								no items
							</div>
						</div>
					}
			</div>
			<div className="card_btn_container">
				<button className="btn" onClick={exit}>exit</button>
			</div>
		</div>
	)
}

export const ProfilePage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const { request, error, clearError, loading } = useHttp()
	const dispatch = useDispatch()
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
	},[error, clearError, alert])

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

	const d = ()=>{
		dispatch({type:CardTypeAction.CARD_SHOW, payload:{content:<CardSession/>}})
	}

	const editpass = ()=>{
		dispatch({type:CardTypeAction.CARD_SHOW, payload:{content:<CardEditPass/>}})
	}

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
			<button onClick={d} className="btn">sessions</button>
			<button onClick={editpass} className="btn">edit password</button>
		</>
	)
}