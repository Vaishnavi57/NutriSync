import { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/authContext';
import { checkAuthLoader } from './utils/authLoader';
import Auth from './components/auth/Auth';
import ErrorPage from './views/ErrorPage';
import Home from './components/dashboard/Home';
import MealLogs from './components/mealLogs/MealLogs';
import Navbar from './components/navBar/Navbar';
import Profile from './components/profile/Profile';
import RootLayout from './components/rootlayout/RootLayout';
import TabBar from './components/UI/tabBar/TabBar';
import Wellness from './components/wellness/Wellness';
import './App.css';

function App() {

  const authContext = useContext(AuthContext);
  const [windowDimension, setWindowDimension] = useState(null);

  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const isMobile = windowDimension <= 640;

  return (
    <>
      {authContext.token && !isMobile && <Navbar />}
      <Routes>
        <Route path='/' element={authContext.token ? <Home /> : <Navigate to='/auth' />} />
        <Route path='/auth' element={!authContext.token ? <Auth /> : <Navigate to='/' />} />
        <Route path='/meal-tracker' element={authContext.token ? <MealLogs /> : <Navigate to='/auth' />} />
        <Route path='/profile' element={authContext.token ? <Profile /> : <Navigate to='/auth' />} />
        <Route path='/wellness' element={authContext.token ? <Wellness /> : <Navigate to='/auth' />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      {authContext.token && isMobile && <TabBar />}
    </>
  );
}

export default App;
