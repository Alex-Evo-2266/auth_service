import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "./pages/authPage"
import { AuthtorizePage } from "./pages/authtorization"
import { ColorsPage } from "./pages/colors"
import { GalleryPage } from "./pages/gallery/gallery"
import { ProfileEditPage } from "./pages/profile/editUserPage"
import { ProfilePage } from "./pages/profile/profilePage"
import { ProfileRootComponent } from "./pages/profile/profileRootComponent"
import { RootComponents } from "./pages/rootComponents"
import { SettingsPage } from "./pages/settings"
import { UsersPage } from "./pages/usersPage"


export const useRoutes = (isAuthenticated:boolean)=>{
	return (
    <Routes>
        {
          (isAuthenticated)?
          <Route path="/" element={<RootComponents/>}>
            <Route path="profile" element={<ProfileRootComponent/>}>
              <Route index element={<ProfilePage/>}/>
              <Route path="edit" element={<ProfileEditPage/>}/>
            </Route>
            <Route index element={<Navigate replace to="/profile" />}/>
            <Route path="gallery" element={<GalleryPage/>}/>
            <Route path="settings" element={<SettingsPage/>}/>
            <Route path="colors" element={<ColorsPage/>}/>
            <Route path="users" element={<UsersPage/>}/>
            <Route path="/*" element={<Navigate replace to="/profile" />} />
          </Route>:
          <>
           <Route path="/" element={<AuthPage/>}/>
           <Route path="/*" element={<Navigate replace to="/" />} />
          </>
        }
        <Route path="authorize" element={<AuthtorizePage/>}/>
      </Routes>
	)
}