import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { MenuTypesActions } from "../../store/reducers/menuReducer";
import { ServicesPage } from "./services"

export const ProfileRootComponent:React.FC = () =>{
	const dispatch = useDispatch()
	const [visible, setVisible] = useState<boolean>(true)

	useEffect(()=>{
		dispatch({type:MenuTypesActions.MENU_SET_NAME, payload:{title: "Profile"}})
	},[dispatch])

	const togle = ()=>{
		setVisible((prev:boolean)=>!prev)
	}

	return(
			<div className="profile-container">
				<div className={`profile ${(visible)?"show":"hide"}`}>
					<div className="switch-profile-btn" onClick={togle}>
						<i className="fas fa-server"></i>
						<i className="fas fa-user"></i>
					</div>
					<Outlet/>
				</div>
				<div className="services">
					<ServicesPage/>
				</div>
			</div>
	)
}
