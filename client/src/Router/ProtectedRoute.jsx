import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ child, redirectPath }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            const res = await fetch('http://localhost:9001/api/v1/auth/check-token', {
                    credentials: "include",
                }
            );
            const auth = await res.json();

            if (auth.message === "Token valide") {
                setIsAuthenticated(true);
            } else {
                navigate(redirectPath);
            }
        }
         checkAuth();
    }, []);
    
    if (isAuthenticated) return child;
}

export default ProtectedRoute;