import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ProtectedRouteByAge({ child, redirectPath }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const { gameId, sectionId, postId } = useParams();
    useEffect(() => {
        async function checkAuth() {
            const res = await fetch('http://localhost:9001/api/v1/auth/check-token', {
                    credentials: "include",
                }
            );
            const auth = await res.json();

            if (auth.message === "Token valide") {
                if (gameId) {
                    const res = await fetch(`http://localhost:9001/api/v1/auth/age/game/${gameId}`, {
                        credentials: "include",
                    });
                    if (res.status === 403) {
                        navigate(redirectPath);
                        return;
                    }
                    setIsAuthenticated(true);
                }
                else if (sectionId) {
                    const res = await fetch(`http://localhost:9001/api/v1/auth/age/section/${sectionId}`, {
                        credentials: "include",
                    });
                    if (res.status === 403) {
                        navigate(redirectPath);
                        return;
                    }
                    setIsAuthenticated(true);
                }
                else if (postId) {
                    const res = await fetch(`http://localhost:9001/api/v1/auth/age/post/${postId}`, {
                        credentials: "include",
                    });
                    if (res.status === 403) {
                        navigate(redirectPath);
                        return;
                    }
                    setIsAuthenticated(true);
                }
            } else {
                navigate("/connexion");
            }
        }
        checkAuth();
    }, []);
    
    if (isAuthenticated) return child;
}

export default ProtectedRouteByAge;