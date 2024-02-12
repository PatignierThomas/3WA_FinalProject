import Header from './views/Header'
import Footer from './views/Footer'
import Router from './Router/Router.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { login } from './store/slices/user.js'

function App() {
    const dispatch = useDispatch();
    const userType = useSelector(state => state.user.role);

    useEffect(() => {
        const checkUser = async () => {
            const res = await fetch('http://localhost:9001/api/v1/auth/check-token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const auth = await res.json();
            if (auth.error) return
            if (res.ok) {
                console.log("I checked the token")
                dispatch(login({ id: auth.id, username: auth.username, role: auth.role, age: auth.age}));
            }

        }
        checkUser();
    }
    ,[userType])

  return (
    <>
        <Header />
        <Router />
        <Footer />
    </>
  )
}

export default App
