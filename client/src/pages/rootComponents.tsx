import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Alert } from "../components/alert";
import { DialogMessage } from "../components/dialog/dialog";
import { Menu } from "../components/menu";
import { useBackgraund } from "../hooks/background.hook";
import { useUserConfig } from "../hooks/userConfig.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";

export const RootComponents:React.FC = () =>{
	const dataConfig = useTypeSelector(state => state.userConfig)
	const {updata} = useUserConfig()
	const {updateBackground} = useBackgraund()

	useEffect(()=>{
		updata()
	},[updata])

	useEffect(()=>{
		updateBackground(dataConfig.backgrounds)
	},[dataConfig])

	return(
		<>
			<Menu/>
			<main className="root-container">
				<Outlet/>
			</main>
		</>
	)
}