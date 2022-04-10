import { IAuthState } from "../../interfaces/authInterfaces"

const storegeName:string = 'SHUserData';

enum AuthTypesActions {
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT"
}

interface IPayload{
	token: string
	id: number
	level: number
}

interface ILoginAction {
	type: AuthTypesActions.LOGIN
	payload:IPayload
}

interface ILogoutAction {
	type: AuthTypesActions.LOGOUT
}

type ActionType = ILoginAction | ILogoutAction

const initialSate = ():IAuthState => {
	let datauser:string | null = localStorage.getItem(storegeName)
	if (!datauser)
		datauser = '{}';
	const data:any = JSON.parse(datauser)
	return{
		token: data?.token || '',
		id: data?.userId || null,
		level: data?.userLevel || null,
		isAuthenticated: !!data.token
	}
}

export const authReducer = (state:IAuthState = initialSate(), action:ActionType):IAuthState => {
	switch (action.type){
		case "LOGIN":
			localStorage.setItem(storegeName, JSON.stringify({
				userId: action.payload.id, userLevel:action.payload.level, token:action.payload.token
			}))
			return {...state, token: action.payload.token, id: action.payload.id, level: action.payload.level, isAuthenticated: !!action.payload.token}
		case "LOGOUT":
			localStorage.removeItem(storegeName)
			return {...state, token: '', id: null, level: null, isAuthenticated: false}
		default:
			return state
	}
}