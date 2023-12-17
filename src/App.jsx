import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './start/Layout/Layout';
import Login from "./start/Login/Login";
import Menu from "./start/Menu/Menu";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Login/>} />
          <Route path="menu" element={<Menu/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}