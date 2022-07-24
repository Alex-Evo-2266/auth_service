import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { IMenuState, MenuTypesActions } from "../store/reducers/menuReducer";

export const Menu:React.FC = () =>{
	const dispatch = useDispatch()
	const menuData:IMenuState = useTypeSelector(state=>state.menu)

	const logout = ():void =>{
		dispatch({type:"LOGOUT"});
	}

	return(
		<>
		<div className="top-menu">
			<div className={`menu-button ${(menuData.visible)?"active":""}`} onClick={()=>dispatch({type: MenuTypesActions.MENU_TOGLE})}>
				<i className="fas fa-bars"></i>
			</div>
			<h1>{menuData.title || ""}</h1>
		</div>
		<div className={`navigation ${(menuData.visible)?"active":""}`}>
			<ul onClick={()=>dispatch({type: MenuTypesActions.MENU_HIDE})}>
				<li>
					<NavLink to="/profile">
						<span className="icon"><i className="fas fa-user"></i></span>
						<span className="title">Profile</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/settings">
						<span className="icon"><i className="fas fa-cogs"></i></span>
						<span className="title">Settings</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/gallery">
						<span className="icon"><i className="fas fa-image"></i></span>
						<span className="title">galery</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/colors">
						<span className="icon"><i className="fas fa-palette"></i></span>
						<span className="title">colors</span>
					</NavLink>
				</li>
				<li>
					<div className="falseLink" onClick={logout}>
						<span className="icon"><i className="fas fa-sign-out-alt"></i></span>
						<span className="title">Logout</span>
					</div>
				</li>
			</ul>
		</div>
		</>
	)
}