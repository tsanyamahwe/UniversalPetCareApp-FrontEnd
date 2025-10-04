import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "./AuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null);
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem("authToken");
            if(token && token.trim() !== ""){
                try {
                    const decoded = jwtDecode(token);
                    const roles = JSON.parse(localStorage.getItem("userRoles")) || [];
                    setUser({
                        id: localStorage.getItem("userId") || decoded.id,
                        roles: decoded.roles,
                        token: token
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userRoles");
                    localStorage.removeItem("userId");
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (token) => {
        localStorage.setItem("authToken", token);
        const decoded = jwtDecode(token);
        localStorage.setItem("userRoles", JSON.stringify(decoded.roles));
        localStorage.setItem("userId", decoded.id);

        setUser({
            id: decoded.id,
            roles: decoded.roles,
            token: token
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        setIsAuthenticated(false);
    };

    return(
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};