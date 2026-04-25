import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../context/UserContext';

export default function PrivateRoute(){
    
    // custom hook that returns the userContext but checks first if user is authenticated or if exists
    const {user} = useCurrentUser(); 
    const navigate = useNavigate();

    useEffect(() => {
        
        if (user == null){
            navigate("/login", {replace: true}) // changes browser history to not allow unauthenticated user to navigate to other pages
        }

        //NEVER IN YOUR FUCKING LIFE PUT AN ELSE STATEMENT HERE  
        //console.log("PrivateRoute user: ", user)
        
    }, [navigate, user])

    return user ? <Outlet /> : <Navigate to="/login"/>;
}