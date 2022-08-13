import { createContext } from "react";

// call it to create context object(not a regular js object) to share data between components of our app 
export const AuthContext=createContext({
    isLoggedIn: false,
    userId: null,
    login: ()=>{},
    logout: ()=>{}
});