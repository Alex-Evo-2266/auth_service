import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {  } from 'react-router-dom'
import { useTypeSelector } from './hooks/useTypeSelector';
import { IAuthState } from './interfaces/authInterfaces';
import { useRoutes } from './routs';
import "./style/index.scss"
import './icon/css/all.css'
import { useBackgraund } from './hooks/background.hook';
import { Alert } from './components/alert';
import { DialogMessage } from './components/dialog/dialog';
import { useColor } from './hooks/color.hook';
import { Card } from './components/card/card';


const App:React.FC = ()=>{
  const authState:IAuthState = useTypeSelector(state=>state.auth)
  const {updateBackground} = useBackgraund()
	const dataConfig = useTypeSelector(state => state.userConfig)
  const {setTheme} = useColor()

  const router = useRoutes(authState.isAuthenticated)

  useEffect(()=>{
		updateBackground(dataConfig.backgrounds, dataConfig.special_topic)
		setTheme({colors: dataConfig.colors, night_colors:dataConfig.night_colors, special_colors:dataConfig.special_colors})
	},[dataConfig, updateBackground, setTheme])

  return (
    <>
      <Alert/>
			<DialogMessage/>
			<Card/>
      <BrowserRouter>
        {router}
      </BrowserRouter>
    </>
  )
}

export default App;
