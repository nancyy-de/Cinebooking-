import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Show from './pages/Show';
import CheckoutDemo from './pages/CheckoutDemo';
import Admin from './pages/Admin';
import './styles.css';
function App(){ return (
  <BrowserRouter>
    <div className="nav"><Link to="/">CineBook</Link></div>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/show/:id" element={<Show/>} />
       <Route path="/checkout" element={<CheckoutDemo/>} />
       <Route path="/admin" element={<Admin/>} />
    </Routes>
  </BrowserRouter>
); }
createRoot(document.getElementById('root')).render(<App/>);
