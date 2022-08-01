import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAlert } from "../hooks/alert.hook";
import { methods, useHttp } from "../hooks/http.hook";
import { useUserConfig } from "../hooks/userConfig.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { AlertType } from "../store/reducers/alertReducer";
import { MenuTypesActions } from "../store/reducers/menuReducer";
import { IUserConfigState, UserConfigTypesActions } from "../store/reducers/userConfigRedicer";

interface ISendData{
	special_topic:boolean
}

export const SettingsPage:React.FC = ()=>{
	const dispatch = useDispatch()
	const { request, error, clearError } = useHttp()
  	const {updata} = useUserConfig()
	const alert = useAlert()
	const dataConfig = useTypeSelector(state => state.userConfig)
	const dataAuth = useTypeSelector(state=>state.auth)

	useEffect(()=>{
		dispatch({type: MenuTypesActions.MENU_SET_NAME, payload:{title:"Settings"}})
	},[dispatch])

	const click = (event: React.ChangeEvent<HTMLInputElement>)=>{
		let data:IUserConfigState = {...dataConfig, [event.target.name]:event.target.checked}
		dispatch({type: UserConfigTypesActions.INSERT_USER_CONFIG, payload:data})
	}

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError, alert])

	const save = async()=>{
		let send_data:ISendData = {
			special_topic: dataConfig.special_topic
		}
		await request("/api/users/config", methods.PATCH, send_data, {Authorization: `Bearer ${dataAuth.token}`})
		updata()
	}

	return(
		<div className="settings">
			<div className="settings_block">
				<div className="settings_block_title">
					<p className="">theme</p>
				</div>
				<div className="settings_block_field">
					<div className="settings_block_field_text">special theme</div>
					<div className="settings_block_field_control">
						<input type="checkbox" className="switch" name="special_topic" onChange={click} checked={dataConfig.special_topic}/>
					</div>
				</div>
			</div>
			<div className="separation"></div>
			<div className="backgrounds settings_block">
			{
				dataConfig.backgrounds.map((item, index)=>{
					return(
						<div key={index} className="background-item">
							<div className="background-item-img">
								<img src={item.url} alt={item.type.toString()}/>
							</div>
							<div className="background-item-title">{item.type.toString()}</div>
						</div>
					)
				})
			}
			</div>
			<div className="separation"></div>
			<button className="btn" onClick={save}>save</button>
		</div>
	)
}