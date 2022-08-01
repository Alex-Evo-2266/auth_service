import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { AlertType } from "../store/reducers/alertReducer"
import { UserConfigTypesActions } from "../store/reducers/userConfigRedicer"
import { useAlert } from "./alert.hook"
import { methods, useHttp } from "./http.hook"
import { useTypeSelector } from "./useTypeSelector"

export const useUserConfig = ()=>{
	const dispatch = useDispatch()
	const {request, error, clearError} = useHttp()
	const {show} = useAlert()
	const dataAuth = useTypeSelector(state => state.auth)

	useEffect(()=>{
		if (!error) return ;
				show(AlertType.ERROR, "fetch error", error)
		return ()=>{
		  clearError();
		}
	  },[error, clearError, show])

	const updata = useCallback(async ()=>{
		const data = await request('/api/users/config', methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		dispatch({type: UserConfigTypesActions.INSERT_USER_CONFIG, payload:data})
	},[request, dispatch, dataAuth.token])

	return { updata }
}