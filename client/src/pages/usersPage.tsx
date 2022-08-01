import React,{useState,useEffect,useCallback} from 'react'
import { Loading } from '../components/loading'
import { UserItem } from '../components/userItem'
import { useAlert } from '../hooks/alert.hook'
import { methods, useHttp } from '../hooks/http.hook'
import { useTypeSelector } from '../hooks/useTypeSelector'
import { IAuthState } from '../interfaces/authInterfaces'
import { IUser } from '../interfaces/profile'
import { AlertType } from '../store/reducers/alertReducer'

export const UsersPage = () => {
	const [users, setUsers] = useState<IUser[]>([])
	const [allUsers, setAllUsers] = useState<IUser[]>([])
	const alert = useAlert()
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const {loading,request, error, clearError} = useHttp();

	const registerPermission = !!(process.env.REACT_APP_REGISTER_USER?.toLowerCase() === "true")

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, alert])

	const updataUsers = useCallback(async()=>{
		const data = await request('/api/users/all', methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		setUsers(data);
		setAllUsers(data)
	},[request, dataAuth.token])

	useEffect(()=>{
		updataUsers()
	},[updataUsers])

	const add = ()=>{

	}

	if(loading){
		return(
			<Loading/>
		)
	}

	return(
		<>
			<div className = "conteiner top">
				<div className = "Users">
					<div className="usersList">
					{
					(users&&users[0])?
					users.map((item,index)=>{
						return(
							<UserItem key={index} user={item} updata={updataUsers}/>
						)
					})
					:null
					}
					</div>
				</div>
			</div>
			{
				(registerPermission)?
				<div onClick={add} className="floating-btn">+</div>:
				null
			}
		</>
	)
}
