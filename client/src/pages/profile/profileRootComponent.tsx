import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { MenuTypesActions } from "../../store/reducers/menuReducer";

export const ProfileRootComponent:React.FC = () =>{
	const dispatch = useDispatch()

	useEffect(()=>{
		dispatch({type:MenuTypesActions.MENU_SET_NAME, payload:{title: "Profile"}})
	},[dispatch])

	return(
			<div className="profile-container">
				<div className="profile">
					<Outlet/>
				</div>
				<div className="services">
				</div>
			</div>
	)
}
