// frontend/src/context/AuthContext.jsx
import { useNavigate} from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    
    const navigate = useNavigate();

    const login = async (userData) => {
        const result = await authService.login(userData);
        
        if (result.success) {        
            // result.data contains { token, user } from backend
            const { 
                token: newToken, 
                user: newUser, 
            } = result.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            setToken(newToken);
            setUser(newUser);
            
            return { success: true };
        }
        
        return { 
            success: false, 
            error: result.error 
        };
    };
        
    const signup = async (userData) => {
        const result = await authService.signup(userData);
        
        if (result.success) {
            const { 
                token: newToken, 
                user: newUser, 
            } = result.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            setToken(newToken);
            setUser(newUser);
            
            return { success: true };
        }
        
        return { 
            success: false, 
            error: result.error 
        };
    };
    
    // logout - clear token and user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };
    
    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {children}    
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// //imports

// import { useNavigate } from "react-router";
// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext(null); //https://react.dev/reference/react/createContext

// export const Authenticator = ({ children }) => {
//     const [token, setToken] = useState(()=>localStorage.getItem('token'));
//     const [user, setUser] = useState(()=>{
//         const savedUser = localStorage.getItem('user');
//         return savedUser ? JSON.parse(savedUser) : null;
//     });

//     const navigate = useNavigate();

//     //useEffect initial async load was loading state as null from the token state
//     //this caused the app to throw users out to login page upon hitting refresh
//     //redirects before token loads - removed useEffect

//     const  login = (newToken, newUser) => {
//         localStorage.setItem('token', newToken);
//         localStorage.setItem('user', JSON.stringify(newUser)); //LocalStorage stores Strings

//         setToken(newToken);
//         setUser(newUser);
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');

//         setToken(null);
//         setUser(null);

//         navigate('/login');
//     };


//     return(
//         <>
//         <AuthContext.Provider value={{ token, user, login, logout}}> 
//             {children}
//         </AuthContext.Provider>
//         </>
//     );

// };

// //custom hook

// export const useAuth = () => useContext(AuthContext);