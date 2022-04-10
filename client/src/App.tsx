import React from 'react';
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {  } from 'react-router-dom'
import { useTypeSelector } from './hooks/useTypeSelector';
import { IAuthState } from './interfaces/authInterfaces';
import { useRoutes } from './routs';
import "./style/index.scss"
import './icon/css/all.css'


const App:React.FC = ()=>{
  const dispatch = useDispatch()
  const authState:IAuthState = useTypeSelector(state=>state.auth)

  const fun = ():void => {
    dispatch({type:"LOGOUT", payload:{id: 4, level: 3, token: "sdfgbhjsadfghjjhgfdsgh"}})
  }

  const router = useRoutes(authState.isAuthenticated)

  return (
    <BrowserRouter>
      {router}
    </BrowserRouter>
  )
}

export default App;
