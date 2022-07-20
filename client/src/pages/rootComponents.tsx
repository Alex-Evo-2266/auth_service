import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Alert } from "../components/alert";
import { DialogMessage } from "../components/dialog/dialog";
import { Menu } from "../components/menu";
import { useBackgraund } from "../hooks/background.hook";
import { useColor } from "../hooks/color.hook";
import { useUserConfig } from "../hooks/userConfig.hook";
import { useTypeSelector } from "../hooks/useTypeSelector";

export const RootComponents:React.FC = () =>{
	const dataConfig = useTypeSelector(state => state.userConfig)
 	const {setTheme} = useColor()
  	const {updata} = useUserConfig()
	const {updateBackground} = useBackgraund()

	useEffect(()=>{
		updata()
	},[updata])

	useEffect(()=>{
		updateBackground(dataConfig.backgrounds)
		setTheme({colors: dataConfig.colors, night_colors:dataConfig.night_colors, special_colors:dataConfig.special_colors})
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