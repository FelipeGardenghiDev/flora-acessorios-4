import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos Providers de Contexto
import { AuthProvider } from './lib/AuthContext';
import { InventoryProvider } from './lib/InventoryProvider';
import { ThemeProvider } from './lib/ThemeContext';

// Importação do Layout Principal
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Importação das Páginas de Autenticação
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Importação das Páginas do Painel
import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import Leaderboard from './pages/Leaderboard';
import SalesReport from './pages/SalesReport';
import History from './pages/History';
import Favourites from './pages/Favourites';
import PageNotFound from './lib/PageNotFound';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InventoryProvider>
          <Router>
            <Routes>
              {/* Rotas de Autenticação (Sem a barra lateral/layout do painel) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Rotas do Painel: exigem sessão válida antes de renderizar o DashboardLayout */}
              <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/sales-report" element={<SalesReport />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/favourites" element={<Favourites />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </InventoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}