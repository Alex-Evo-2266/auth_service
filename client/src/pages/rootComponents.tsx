import React from "react";
import { Outlet } from "react-router-dom";
import { Alert } from "../components/alert";
import { DialogMessage } from "../components/dialog/dialog";
import { Menu } from "../components/menu";

export const RootComponents:React.FC = () =>{
	return(
		<>
			<Menu/>
			<Alert/>
			<DialogMessage/>
			<main>
				<div className="container">
					<Outlet/>
				</div>
			</main>
		</>
	)
}