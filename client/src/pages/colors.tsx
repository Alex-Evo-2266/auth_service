import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAlert } from "../hooks/alert.hook";
import { useColor } from "../hooks/color.hook";
import { methods, useHttp } from "../hooks/http.hook";
import { useUserConfig } from "../hooks/userConfig.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { IColors, night_colors } from "../interfaces/colorInterfaces";
import { AlertType } from "../store/reducers/alertReducer";
import { DialogType, DialogTypeAction } from "../store/reducers/dialogReducer";
import { MenuTypesActions } from "../store/reducers/menuReducer";

interface IColorsId{
	title:string
	color1:string
	color2:string
	active:string
	id:number
}

const baseColor = ():IColors=>{
	let color = night_colors
	color.title = ""
	return color
}

export const ColorsPage:React.FC = ()=>{
	const dispatch = useDispatch()
	const dataConfig = useTypeSelector(state => state.userConfig)
	const dataAuth = useTypeSelector(state=>state.auth)
	const alert = useAlert()
	const { updata } = useUserConfig()
	const {setTheme} = useColor()
	const [color, setColor] = useState<IColors>(baseColor())
	const [colors, setAllColors] = useState<IColorsId[]>([])
	const {setColors} = useColor()
	const { request, error, clearError } = useHttp()

	useEffect(()=>{
		dispatch({type: MenuTypesActions.MENU_SET_NAME, payload:{title:"Colors"}})
	},[])

	const getColors = useCallback(async()=>{
		const data = await request("/api/color", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		setAllColors(data)
	},[request, dataAuth.token])

	useEffect(()=>{
		getColors()
	},[getColors])

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	const changeHandler = (event:React.ChangeEvent<HTMLInputElement>)=>{
		setColor(prev=>({...prev, [event.target.name]:event.target.value}))
	}

	const show = ()=>{
		setColors(color)
	}

	const save = async()=>{
		if (color.title === "")
			return alert.show(AlertType.ERROR, "title empty", "")
		await request("/api/color/create", methods.POST, color, {Authorization: `Bearer ${dataAuth.token}`})
		setTheme({colors: dataConfig.colors, night_colors:dataConfig.night_colors})
		setTimeout(()=>{
			getColors()
		},500)
	}

	const linc = (id:number)=>{
		const items = [
			{
				title: "set light theme",
				data: "LIGHT"
			},
			{
				title: "set night theme",
				data: "NIGHT"
			},
			{
				title: "delete",
				data: "DELETE"
			}
		]
		dispatch({type:DialogTypeAction.DIALOG_SHOW, payload:{type:DialogType.CONFIRMATION, title:"action", items:items, callback:async(data:any)=>{
			if (data.data == "DELETE")
				await request(`/api/color/${id}`, methods.DELETE, null, {Authorization: `Bearer ${dataAuth.token}`})
			else
				await request(`/api/users/color/${data.data}/set/${id}`, methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
			setTimeout(()=>{
				updata()
				getColors()
			},500)
		}}})
	}



	return(
		<div className="colors">
			<div className="theme_create">
				<h2>create theme</h2>
				<div className="input-container">
					<div className="input-data">
						<input required type="text" name="title" onChange={changeHandler} value={color.title}/>
						<label>Name</label>
					</div>
				</div>
				<div className="colors_inputs">
					<div className="colors_input">
						<p>color1</p>
						<input required type="color" name="color1" onChange={changeHandler} value={color.color1}/>
					</div>
					<div className="colors_input">
						<p>color2</p>
						<input required type="color" name="color2" onChange={changeHandler} value={color.color2}/>
					</div>
					<div className="colors_input">
						<p>active</p>
						<input required type="color" name="active" onChange={changeHandler} value={color.active}/>
					</div>
				</div>
				<div className="btn_container">
					<button onClick={show} className="btn">Show</button>
					<button onClick={save} className="btn">Save</button>
				</div>
			</div>
			<div className="colors_div">
				<div className="colors">
					{
					colors.map((item,index)=>(
						<div className="color_container" key={index} onClick={()=>linc(item.id)}>
							<div className="styleIcon">
      							<div className="styleIcon-color" style={{background:item.color1}}></div>
    							<div className="styleIcon-color" style={{background:item.color2}}></div>
    							<div className="styleIcon-color" style={{background:item.active}}></div>
	    					</div>
							<p>{item.title}</p>
						</div>
						)
					)
					}
				</div>
			</div>
		</div>
	)
}