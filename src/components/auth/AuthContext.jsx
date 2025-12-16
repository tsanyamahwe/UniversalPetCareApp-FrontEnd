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
            try{
                const token = localStorage.getItem("token");
                if(token && token.trim() !== ""){
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now()/1000;
                    if(decoded.exp && decoded.exp < currentTime){
                        console.log("Token expired");
                        localStorage.removeItem("token");
                        localStorage.removeItem("userRoles");
                        localStorage.removeItem("userId");
                        setIsAuthenticated(false);
                        setUser(null);
                    }else{
                        const roles = JSON.parse(localStorage.getItem("userRoles")) || decoded.roles || [];
                        setUser({
                            id: localStorage.getItem("userId") || decoded.id,
                            email: decoded.sub || decoded.email,
                            roles: decoded.roles,
                            token: token
                        });
                        setIsAuthenticated(true);
                    }
                }
            }catch(error) {
                console.error("Invalid or expired token:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("userRoles");
                localStorage.removeItem("userId");
                setIsAuthenticated(false);
                setUser(null);
            }finally{
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem("token", token);
            localStorage.setItem("userRoles", JSON.stringify(decoded.roles || []));
            localStorage.setItem("userId", decoded.id);
            setUser({
                id: decoded.id,
                email: decoded.sub || decoded.email,
                roles: decoded.roles || [],
                token: token
            });
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Error decoding token: ", error);
            return false;
        } 
    };

    const logout = () => {
        try {
            //server-side log out
            logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        }finally{
         //client-side log out
        localStorage.removeItem("token");
        localStorage.removeItem("userRoles");
        localStorage.removeItem("userId");
        //clear React state
        setUser(null);
        setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return(
        <AuthContext.Provider value={value}>
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