import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "./pages/authPage"
import { ProfilePage } from "./pages/profilePage"


export const useRoutes = (isAuthenticated:boolean)=>{
	return (
    <Routes>
        {
          (isAuthenticated)?
          <>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/*" element={<Navigate replace to="/profile" />} />
          </>:
          <Route path="/" element={<AuthPage/>}/>
        }
      </Routes>
	)
}