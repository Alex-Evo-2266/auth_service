import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MenuTypesActions } from "../store/reducers/menuReducer";

export const SettingsPage:React.FC = ()=>{
	const dispatch = useDispatch()

	useEffect(()=>{
		dispatch({type: MenuTypesActions.MENU_SET_NAME, payload:{title:"Colors"}})
	},[])

	return(
		<div className="settings">
			<div className="settings_block">
				<div className="settings_block_title">
					<p className="">color</p>
				</div>
				<div className="settings_block_field">
					<div className="settings_block_field_text">night theme auto switch</div>
					<div className="settings_block_field_control">
						<input type="checkbox" className="switch"/>
					</div>
				</div>
				<div className="settings_block_field">
					<div className="settings_block_field_text">base color</div>
					<div className="settings_block_field_control">
						
					</div>
				</div>
			</div>
			<div className="separation"></div>
		</div>
	)
}