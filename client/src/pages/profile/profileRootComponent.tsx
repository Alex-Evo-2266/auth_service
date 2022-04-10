import React from "react";
import { Outlet } from "react-router-dom";

export const ProfileRootComponent:React.FC = () =>{
	
	return(
		<div className="container">
			<div className="profile-container">
				<div className="profile">
					<Outlet/>
				</div>
				<div className="services">
				</div>
			</div>
		</div>
	)
}