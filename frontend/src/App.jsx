import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Index from './pages/Index';
import CourseDetail from './pages/CourseDetail';
import NotFound from './pages/NotFound';
import DashboardSummary from './components/DashboardPanel';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <>
    <DashboardSummary />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
