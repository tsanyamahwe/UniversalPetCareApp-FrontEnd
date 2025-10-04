import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/home/Home';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import VeterinarianListing from './components/veterinarian/VeterinarianListing';
import BookAppointment from './components/appointment/BookAppointment';
import Veterinarian from './components/veterinarian/Veterinarian';
import UserRegistration from './components/user/UserRegistration';
import Login from './components/auth/Login';
import UserProfile from './components/user/UserProfile';
import UserDashboard from './components/user/UserDashboard';
import UserUpdate from './components/user/UserUpdate';
import AdminDashboard from './components/admin/AdminDashboard';
import EmailVerification from './components/auth/EmailVerification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PasswordResetRequest from './components/auth/PasswordResetRequest';
import ResetPassword from './components/auth/ResetPassword';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
     <Route path='/' element={<RootLayout/>}>
        /**======================Routes accessible without authentication========================= */
          <Route index element={<Home/>}/>
          <Route path='/doctors' element={<VeterinarianListing/>}/>
          <Route path='/doctors/veterinarian/:vetId/veterinarian' element={<Veterinarian/>}/> 
          <Route path='/register-user' element={<UserRegistration/>}/>
          <Route path='/login' element={<Login/>}/> 
          <Route path='/email-verification' element={<EmailVerification/>}/> 
          <Route path='/vet-reviews/:vetId/veterinarian' element={<Veterinarian/>}/>
          <Route path='/password-reset-request' element={<PasswordResetRequest/>}/>
          <Route path ='/reset-password' element={<ResetPassword/>}/>
        /**=====================Routes accessible without authentication=========================== */
          
        /**====================Routes accessible for authenticated users=========================== */
          <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT", "ROLE_ADMIN", "ROLE_VETERINARIAN"]} useOutlet={true}/>}> 
              <Route path='/book-appointment/:recipientId/new-appointment' element={<BookAppointment/>}/>
              <Route path='/update-user/:userId/update' element={<UserUpdate/>}/> 
              <Route path='/user-dashboard/:userId/my-dashboard' element={<UserDashboard/>}/> 
          </Route>
        /**===================Routes accessible for authenticated users=========================== */

        /**=========================Routes accessible for admin ONLY============================== */
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} useOutlet={true}/>}>
              <Route path='/admin-dashboard/:userId/admin-dashboard' element={<AdminDashboard/>}/> 
          </Route> 
        /**=========================Routes accessible for admin ONLY============================== */
     </Route>
  ))
  return (
    <AuthProvider>
      <main className="">
        <RouterProvider router={router}/>      
      </main>
    </AuthProvider>
  );
};

export default App;
 