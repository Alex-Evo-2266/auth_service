import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../components/menu";

export const RootComponents:React.FC = () =>{
	return(
		<>
			<Menu/>
			<main>
				<Outlet/>
			</main>
		</>
	)
}