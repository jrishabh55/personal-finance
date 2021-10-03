// Create a router and add the routes with react-router-dom
import { AuthProvider } from 'contexts/AuthContext';
import { Dashboard } from 'pages/Dashboard';
import { Login } from 'pages/Login';
import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

// Create router component
export const Routes: FC = () => {
  return (
    <Switch>
      <AuthProvider>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Dashboard} />
      </AuthProvider>
    </Switch>
  );
};
