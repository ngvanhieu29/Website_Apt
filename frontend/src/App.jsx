import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ApartmentDetail from './pages/ApartmentDetail';
import ContactPopup from './components/ContactPopup';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenContact={() => setContactOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
          <Route
            path="/"
            element={<Home onOpenContact={() => setContactOpen(true)} />}
          />
          <Route
  path="/apartment/:id"
  element={<ApartmentDetail onOpenContact={() => setContactOpen(true)} />}
/>
            <Route path="/about" element={<About />} />
        </Routes>
      
      </main>

      <Footer />

      {/* Popup dùng chung */}
      <ContactPopup open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

export default App;