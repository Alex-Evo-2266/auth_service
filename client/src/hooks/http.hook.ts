
import {useState, useCallback, useContext} from 'react'
import { useDispatch } from 'react-redux'

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message
	return String(error)
}

export enum methods{
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export const useHttp = () => {
	const dispatch = useDispatch()
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async ()=>{
    const response = await fetch("/api/auth/refresh", {method:"GET", body:null, headers:{}});
    const data = await response.json()
    if (!response.ok) {
	  dispatch({type: "LOGOUT"})
      throw new Error(data.message||'что-то пошло не так')
    }
	dispatch({type: "LOGIN", payload:{id: data.userId, level: data.userLavel, token: data.token}})
    return data.token
  },[dispatch])

  const request = useCallback(async (url:string, method:methods=methods.GET , body = null, headers = {},file:boolean=false) => {
    setLoading(true);
    try {
      if(headers['Authorization'])
      {
        headers['Authorization-Token'] = headers['Authorization']
        // headers['Authorization'] = undefined
      }
      if(body&&!file){
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body);
      }
      let response = await fetch(url, {method, body, headers});
      if (response.status === 401){
        const token = await refresh()
        headers["Authorization-Token"] = `Bearer ${token}`
        response = await fetch(url, {method, body, headers});
      }
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message||'что-то пошло не так')
      }
      setLoading(false);
      return data;
    } catch (e) {
		setLoading(false)
		setError(getErrorMessage(e))
    }
  },[refresh]);

  const clearError = useCallback(() => {setError(null)},[]);

  return {loading, request, error, clearError}
}
