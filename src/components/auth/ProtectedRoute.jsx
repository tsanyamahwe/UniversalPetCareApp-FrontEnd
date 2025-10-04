import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({children, allowedRoles = [], useOutlet = false}) => {
    const {user, isAuthenticated, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return <div>Loading...</div>
    }
    if(!isAuthenticated){
        return <Navigate to='/login' state={{from: location}} replace/>;
    };

    const userRoles = user?.roles || [];
    const userRolesLower = userRoles.map((role) => role.toLowerCase());
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());
    const isAuthorized = userRolesLower.some((userRole) => allowedRolesLower.includes(userRole));

    if(isAuthorized){
        return useOutlet ? <Outlet/> : children; //Optionally render children or an Outlet based on useOutlet flag
    }else{
        return <Navigate to='/unauthorized' state={{from: location}} replace/>; //Redirect to a default or unauthorized access page if the user doesn't have an allowed role
    };
};

export default ProtectedRoute;
