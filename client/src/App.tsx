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


const App:React.FC = ()=>{
  const authState:IAuthState = useTypeSelector(state=>state.auth)
  const {updateBackground} = useBackgraund()

  const router = useRoutes(authState.isAuthenticated)

  useEffect(()=>{
    updateBackground([])
  },[updateBackground])

  return (
    <>
      <Alert/>
			<DialogMessage/>
      <BrowserRouter>
        {router}
      </BrowserRouter>
    </>
  )
}

export default App;
