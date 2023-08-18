import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AlertPopup from './components/AlertPopup';
import Header from './components/Header';

import CryptoJS from 'crypto-js';
import { API_URL, APP_PREFIX, TOKEN_KEY, REFRESH_KEY } from './actions/variables';
import { UserModel } from './models';

import {
  AuthSignInPage, AuthForgetPasswordPage, AuthResetPasswordPage, AuthPageLoading
} from './views/auth';
const AuthComingSoonPage = lazy(() => import('./views/auth/ComingSoonPage'));
const AuthPage404 = lazy(() => import('./views/auth/Page404'));


function App() {
  VerifySignedIn();
  return (
    <BrowserRouter>
      <div className="page-main">
        <Header />
        <Suspense fallback={<AuthPageLoading />}>
          <Routes>

            <Route path="/" element={<NotSignedInRoute element={AuthSignInPage} />} />
            <Route path="/auth/signin" 
              element={<NotSignedInRoute element={AuthSignInPage} />} />
            <Route path="/auth/forget-password" 
              element={<NotSignedInRoute element={AuthForgetPasswordPage} />} />
            <Route path="/auth/reset-password/*" 
              element={<NotSignedInRoute element={AuthResetPasswordPage} />} />
            

            {/* START: Admin *************************************************************** */}
            {/* Admin */}
            <Route path="/admin" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/DashboardPage'))} />} />
            <Route path="/admin/dashboard" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/DashboardPage'))} />} />
            
            <Route path="/admin/admins" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/AdminsPage'))} />} />
            <Route path="/admin/admin/view/:dataId" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/AdminViewPage'))} />} />
            <Route path="/admin/admin/:process/*" 
              element={<ProtectedRoute auth={GuardSuperAdmin()} 
              element={lazy(() => import('./views/admin/AdminPage'))} />} />
            
            <Route path="/admin/users" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/UsersPage'))} />} />
            {/* <Route path="/admin/user/view/:dataId" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/UserViewPage'))} />} /> */}
            <Route path="/admin/user/:process/*" 
              element={<ProtectedRoute auth={GuardSuperAdmin()} 
              element={lazy(() => import('./views/admin/UserPage'))} />} />
            
            {/* Personal */}
            <Route path="/admin/profile" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/ProfileViewPage'))} />} />
            <Route path="/admin/profile/update" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/ProfilePage'))} />} />

            {/* Asset */}
            <Route path="/admin/asset-categories" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/AssetCategoriesPage'))} />} />
            {/* <Route path="/admin/asset-category/view/:dataId" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/AssetCategoryViewPage'))} />} /> */}
            <Route path="/admin/asset-category/:process/*" 
              element={<ProtectedRoute auth={GuardAdmin()} 
              element={lazy(() => import('./views/admin/AssetCategoryPage'))} />} />
            {/* END: Admin ***************************************************************** */}
            

            {/* START: User **************************************************************** */}
            {/* User */}
            <Route path="/user" 
              element={<ProtectedRoute auth={GuardUser()} 
              element={lazy(() => import('./views/user/DashboardPage'))} />} />
            <Route path="/user/dashboard" 
              element={<ProtectedRoute auth={GuardUser()} 
              element={lazy(() => import('./views/user/DashboardPage'))} />} />
            {/* END: User ****************************************************************** */}


            <Route path="/admin/coming-soon/*" element={<AuthComingSoonPage />} />
            <Route path="/user/coming-soon/*" element={<AuthComingSoonPage />} />
            <Route path="*" element={<AuthPage404 />} />
          </Routes>
        </Suspense>
      </div>
      <AlertPopup />
    </BrowserRouter>
  );
}


// Verify
const VerifySignedIn = async () => {
  let temp = localStorage.getItem(`${APP_PREFIX}_REFRESH`);
  if(!temp) return true;

  let bytes = CryptoJS.AES.decrypt(temp, REFRESH_KEY);
  let oldRefreshToken = bytes.toString(CryptoJS.enc.Utf8);

  const fetch1 = await fetch(`${API_URL}auth/refresh`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: oldRefreshToken })
  });
  if(!fetch1.ok || fetch1.status !== 200){
    localStorage.removeItem(`${APP_PREFIX}_USER`);
    localStorage.removeItem(`${APP_PREFIX}_ACCESS`);
    localStorage.removeItem(`${APP_PREFIX}_REFRESH`);
    window.location.reload();
    return false;
  }else{
    let data1 = await fetch1.json();
    let user = new UserModel(data1.data.user);
    let accessToken = CryptoJS.AES.encrypt(data1.data.accessToken, TOKEN_KEY).toString();
    let refreshToken = CryptoJS.AES.encrypt(data1.data.refreshToken, REFRESH_KEY).toString();
    localStorage.setItem(`${APP_PREFIX}_USER`, JSON.stringify(user));
    localStorage.setItem(`${APP_PREFIX}_ACCESS`, accessToken);
    localStorage.setItem(`${APP_PREFIX}_REFRESH`, refreshToken);
  }
  
  return true;
};


// Routes
const ProtectedRoute = ({ auth, redirect="/", element: Element }) => {
  if(auth){
    return <Element />;
  }else{
    return <Navigate replace to={redirect} />;
  }
};
const NotSignedInRoute = ({ element: Element }) => {
  let user = localStorage.getItem(`${APP_PREFIX}_USER`);
  if(!user) return <Element />;

  user = new UserModel(JSON.parse(user));
  if(!user.isSignedIn()) return <Element />;

  if(user.isAdmin()) return <Navigate replace to="/admin" />;
  else if(user.isInternal()) return <Navigate replace to="/internal" />;
  else if(user.isCompany()) return <Navigate replace to="/company" />;
  else if(user.isAgency()) return <Navigate replace to="/agency" />;
  else if(user.isHomeOwner()) return <Navigate replace to="/owner" />;
  else if(user.isUser()) return <Navigate replace to="/user" />;
  else return <Navigate replace to="/no-permission" />;
};


// Guards
const GuardSuperAdmin = () => {
  let user = localStorage.getItem(`${APP_PREFIX}_USER`);
  if(!user) return false;
  user = new UserModel(JSON.parse(user));
  if(!user.isSuperAdmin()) {
    return false;
  }
  return true;
};
const GuardAdmin = () => {
  let user = localStorage.getItem(`${APP_PREFIX}_USER`);
  if(!user) return false;
  user = new UserModel(JSON.parse(user));
  if(!user.isAdmin()) {
    return false;
  }
  return true;
};
const GuardUser = () => {
  let user = localStorage.getItem(`${APP_PREFIX}_USER`);
  if(!user) return false;
  user = new UserModel(JSON.parse(user));
  if(!user.isUser()) {
    return false;
  }
  return true;
};


export default App;