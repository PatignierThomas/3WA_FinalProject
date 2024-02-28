import Header from './views/Header'
import Footer from './views/Footer'
import Router from './Router/Router.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { login } from './store/slices/user.js'
import { checkToken } from './store/slices/checkToken.js'

function App() {
    const dispatch = useDispatch();
    const userType = useSelector(state => state.user.role);
    const { data } = useSelector(state => state.checkToken);

    useEffect(() => {
        dispatch(checkToken());
        // const checkUser = async () => {
        //     const res = await fetch('http://localhost:9001/api/v1/auth/check-token', {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         credentials: 'include'
        //     })
        //     const result = await res.json();
        //     if (result.error) return
        //     console.log(result)
        //     if (res.ok) {
        //         console.log("I checked the token")
        //         dispatch(login(result.data));
        //     }
        // }
        // checkUser();
    }
    ,[userType])

    useEffect(() => {
        dispatch(login(data));
    }
    ,[data])

  return (
    <>
        <Header />
        <Router />
        <Footer />
    </>
  )
}

export default App
