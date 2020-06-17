import React from 'react'
import './App.scss'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MenuBar from './components/Menu/MenuBar'
import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

function App() {
    // const context = useContext(AuthContext)
    return (
        <AuthProvider>
            <Router>
                <div className="ui container">
                    <MenuBar />
                    {/* {!context.user && <Redirect from="/" to="login" exact />} */}
                    <Route exact path="/" component={Home} />
                    <AuthRoute path="/login" component={Login} />
                    <AuthRoute path="/register" component={Register} />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
