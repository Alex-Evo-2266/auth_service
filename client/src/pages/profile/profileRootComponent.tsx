import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { AlertType, AlertTypeAction } from "../../store/reducers/alertReducer";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";
import { MenuTypesActions } from "../../store/reducers/menuReducer";

export const ProfileRootComponent:React.FC = () =>{
	const dispatch = useDispatch()

	useEffect(()=>{
		dispatch({type:MenuTypesActions.MENU_SET_NAME, payload:{title: "Profile"}})
		dispatch({type:DialogTypeAction.DIALOG_SHOW, payload:{type: DialogType.ALERT,items:[
			{title: "fg1", data: "d1"},
			{title: "fg2", data: "d2"},
			{title: "fg3", data: "d3"},
		], text: "dfghnh", title: "fsdgfhj", callback: (str:any)=>{console.log(str)}}})
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