import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {  } from 'react-router-dom'
import { useTypeSelector } from './hooks/useTypeSelector';
import { IAuthState } from './interfaces/authInterfaces';
import { useRoutes } from './routs';
import "./style/index.scss"
import './icon/css/all.css'


const App:React.FC = ()=>{
  const authState:IAuthState = useTypeSelector(state=>state.auth)

  const router = useRoutes(authState.isAuthenticated)

  return (
    <BrowserRouter>
      {router}
    </BrowserRouter>
  )
}

export default App;
