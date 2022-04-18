import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useUserConfig } from "../../hooks/userConfig.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { BackgroundTypes, IImage } from "../../interfaces/ImageInterfaces";
import { AlertType } from "../../store/reducers/alertReducer";
import { DialogType, DialogTypeAction } from "../../store/reducers/dialogReducer";

interface DetailImageProps{
	image: IImage
	hide?: ()=>void
	next?: ()=>void
	prev?: ()=>void
}

export const DetailImage:React.FC<DetailImageProps> = (props)=>{
	const dispatch = useDispatch()
	const alert = useAlert()
	const dataAuth = useTypeSelector(state => state.auth)
	const { updata } = useUserConfig()
	const {request, error, clearError} = useHttp()

	const close = ()=>{
		if (typeof(props.hide) === "function")
			props.hide()
	}

	const next = ()=>{
		if (typeof(props.next) === "function")
			props.next()
	}

	const prev = ()=>{
		if (typeof(props.prev) === "function")
			props.prev()
	}

	const setBackground = ()=>{
		const items = [
			{
				title: "base",
				data: BackgroundTypes.BASE
			},
			{
				title: "day",
				data: BackgroundTypes.DAY
			},
			{
				title: "evening",
				data: BackgroundTypes.EVENING
			},
			{
				title: "morning",
				data: BackgroundTypes.MORNING
			},
			{
				title: "night",
				data: BackgroundTypes.NIGHT
			}
		]
		dispatch({type:DialogTypeAction.DIALOG_SHOW, payload:{type: DialogType.CONFIRMATION, title: "Type background", items:items, callback:async(data:any)=>{
			await request(`/api/background/${data.data}/set/${props.image.id}`, methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
			await updata()
		}}})
	}

	const setProfile = ()=>{
		dispatch({type:DialogTypeAction.DIALOG_SHOW, payload:{type: DialogType.ALERT, title: "Set profile", text:"set image profile?", callback:async(data:any)=>{
			await request(`/api/users/profile/set/${props.image.id}`, methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		}}})
	}

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
    	return ()=>{
     		clearError();
    	}
	},[error, clearError])

	return(
		<>
			<div className="image-detail">
				<span className="exit" onClick={close}></span>
				<span className="next" onClick={next}><i className="fas fa-arrow-right"></i></span>
				<span className="prev" onClick={prev}><i className="fas fa-arrow-left"></i></span>
				<div className="image-content">
					<img src={props.image.url} alt={props.image.title} />
					<div className="title">
						<p>{props.image.title}</p>
					</div>
					<div className="image-control btn_container">
						<button className="btn" onClick={setBackground}>set as background</button>
						<button className="btn" onClick={setProfile}>set to profile</button>
					</div>
				</div>
			</div>
		</>
	)
}