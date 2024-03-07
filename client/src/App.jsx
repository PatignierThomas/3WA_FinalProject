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
    }
    ,[userType])

    useEffect(() => {
        dispatch(login(data));
    }
    ,[data])

  return (
    <>
        <Header />
        <main>
            <Router />
        </main>
        <Footer />
    </>
  )
}

export default App
