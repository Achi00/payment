import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import App from './App';
import How from "./How/How"
import Card from "./CardDesign/CardDesign"
import "./index.css"

function Main() {
  return (
    <>
      <BrowserRouter>
      <div className="links">
        <Link className='link' to="/">Home</Link>
        <Link className='link' to="/how">How It Works</Link>
        <Link className='link' to="/card">Create Card Design</Link>
      </div>
        <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/how" element={<How />}/>
          <Route path="/card" element={<Card />}/>
        </Routes>
      </BrowserRouter>
      </>
  )
}

export default Main