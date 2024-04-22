import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ProtectedAdminRoute({ child, redirectPath }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch("http://localhost:9001/api/v1/auth/check-token",
                {
                    credentials: "include",
                }
            );
            const result = await res.json();
            if (res.ok && result.message === "No Token" || result.data.role !== "admin") {
                return navigate(redirectPath);
            }
            setIsAuthenticated(true);
        }
         checkAuth();
    }, []);

    if (isAuthenticated) return child;
}

export default ProtectedAdminRoute;

