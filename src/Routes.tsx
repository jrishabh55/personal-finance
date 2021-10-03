// Create a router and add the routes with react-router-dom
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { Dashboard } from "pages/Dashboard";
import { Login } from "pages/Login";
import { useEffect, useRef } from "react";
import { getAuth } from "@firebase/auth";
import { AuthProvider } from "contexts/AuthContext";

// Create router component
export const Routes = () => {
  return (
    <Switch>
      <AuthProvider>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Dashboard} />
      </AuthProvider>
    </Switch>
  );
};
