// Create a router and add the routes with react-router-dom
import TopBar from 'components/Topbar';
import { AuthProvider } from 'contexts/AuthContext';
import { Dashboard } from 'pages/Dashboard';
import { Login } from 'pages/Login';
import { FC } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

// Create router component
export const Routes: FC = () => {
  return (
    <AuthProvider>
      <TopBar />
      <RouterRoutes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </RouterRoutes>
    </AuthProvider>
  );
};
