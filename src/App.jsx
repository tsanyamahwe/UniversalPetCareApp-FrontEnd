import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/home/Home';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import VeterinarianListing from './components/veterinarian/VeterinarianListing';
import BookAppointment from './components/appointment/BookAppointment';
import Veterinarian from './components/veterinarian/Veterinarian';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
     <Route path='/' element={<RootLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='/doctors' element={<VeterinarianListing/>}/>
        <Route path='/book-appointment/:recipientId/new-appointment' element={<BookAppointment/>}/>
        <Route path='doctors/veterinarian/:vetId/veterinarian' element={<Veterinarian/>}/> 
     </Route>
  ))
  return (
    <main className="">
      <RouterProvider router={router}/>      
    </main>
  );
}

export default App;
 