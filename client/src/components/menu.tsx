import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

export const Menu:React.FC = () =>{
	const dispatch = useDispatch()

	const logout = ():void =>{
		dispatch({type:"LOGOUT"});
	}

	return(
		<>
		<div className="top-menu">
			<h1>{}</h1>
		</div>
		<div className="navigation">
			<ul>
				<li>
					<NavLink to="/profile">
						<span className="icon"><i className="fas fa-user"></i></span>
						<span className="title">Profile</span>
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