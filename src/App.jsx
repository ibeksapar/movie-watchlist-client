import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Movies from './features/movies/Movies';
import MovieDetails from './features/movies/MovieDetails';
import AddMovie from './features/movies/AddMovie';
import UpdateMovie from './features/movies/UpdateMovie';
import Login from './features/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import useAuthCheck from './validate/useAuthCheck';
import Genres from './features/genres/Genres';
import Register from './features/auth/Register';
import AppLayout from './components/Layout';
import About from './features/about/About';

function App() {
   const [token, setToken] = useState(localStorage.getItem('token'));

   useAuthCheck(setToken);

   useEffect(() => {
      const onStorage = () => setToken(localStorage.getItem('token'));
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
   }, []);

   return (
      <AppLayout token={token} setToken={setToken}>
         <Routes>
            <Route
               path='/login'
               element={
                  token ? (
                     <Navigate to='/' replace />
                  ) : (
                     <Login setToken={setToken} />
                  )
               }
            />
            <Route
               path='/register'
               element={token ? <Navigate to='/' replace /> : <Register />}
            />
            <Route
               path='/'
               element={
                  <PrivateRoute token={token}>
                     <Movies token={token} />
                  </PrivateRoute>
               }
            />
            <Route
               path='/movies/:id'
               element={
                  <PrivateRoute token={token}>
                     <MovieDetails token={token} />
                  </PrivateRoute>
               }
            />
            <Route
               path='/add-movie'
               element={
                  <PrivateRoute token={token}>
                     <AddMovie token={token} />
                  </PrivateRoute>
               }
            />
            <Route
               path='/movies/edit/:id'
               element={
                  <PrivateRoute token={token}>
                     <UpdateMovie token={token} />
                  </PrivateRoute>
               }
            />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
            <Route
               path='/genres'
               element={
                  <PrivateRoute token={token}>
                     <Genres token={token} />
                  </PrivateRoute>
               }
            />
         </Routes>
      </AppLayout>
   );
}

export default App;
