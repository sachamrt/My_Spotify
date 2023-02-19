import React from 'react';
import logo from './assets/Spotify_Logo.png';
import './Login.css';

function Login() {
    return (
        <div className="Pages">
            <div className='logo_login'>
                <img
                src={logo}
                alt="Spotify Logo"
                width="400"
                />
            </div>
            <div>
                <a className="btn-spotify" href="/auth/login" >
                    Login with Spotify 
                </a>
            </div>
        </div>
    );
}

export default Login;