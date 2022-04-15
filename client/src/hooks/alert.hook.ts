import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { AlertType, AlertTypeAction } from "../store/reducers/alertReducer"

export const useAlert = () => {
	const dispatch = useDispatch()

	const show = useCallback((type:AlertType, title:string, text:string)=>{
		dispatch({type:AlertTypeAction.ALERT_SHOW, payload:{type, title, text}})
	},[dispatch])

	const hide = useCallback(()=>{
		dispatch({type:AlertTypeAction.ALERT_HIDE})
	},[dispatch])

	return {show, hide}
}