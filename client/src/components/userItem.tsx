import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAlert } from '../hooks/alert.hook'
import { methods, useHttp } from '../hooks/http.hook'
import { useTypeSelector } from '../hooks/useTypeSelector'
import { IAuthState } from '../interfaces/authInterfaces'
import { IUser } from '../interfaces/profile'
import { AlertType } from '../store/reducers/alertReducer'
import { DialogType, DialogTypeAction } from '../store/reducers/dialogReducer'

interface IProp{
	user: IUser
	updata?: ()=>{}
}

export const UserItem = (prop:IProp)=>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const dispatch = useDispatch()
	const {show} = useAlert()
	const {request, error, clearError} = useHttp();

	useEffect(()=>{
		if (error)
			show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, show])

	return(
		<div className="userElement">
			<div className="content">
				<p>Email: {prop.user.email}</p>
				<div className='userImg'>
					<img alt="user icon" src={prop.user.imageURL}/>
				</div>
				<h3>{prop.user.name} {prop.user.surname}</h3>
				<div className="control">
				{
					(dataAuth.level===3&&dataAuth.id!==prop.user.id)?
					<button className="editBtn" onClick={()=>{}}>Edit</button>:
					null
				}
				{
					(dataAuth.id===prop.user.id)?
					<Link className="editBtn" to="/profile/edit">Edit</Link>:
					(dataAuth.level===3)?
					<button className="deletBtn" onClick={()=>{
						dispatch({type: DialogTypeAction.DIALOG_SHOW, payload:{type:DialogType.ALERT, title:"delete?", text:"delete client app", callback:async ()=>{
							await request(`/api/users/${prop.user.id}`, methods.POST, null, {Authorization: `Bearer ${dataAuth.token}`})
							if (prop.updata)
								prop.updata()
						}}})
					}}>delete</button>:
					null
				}
				</div>
			</div>
		</div>
	)
}
