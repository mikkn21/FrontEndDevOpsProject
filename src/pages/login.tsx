import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Button from '../components/Button/Button';
import Slideshow from '../components/SlideShow/slideShow';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLoginClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setError(''); 


        // hacky ADMIN login
        if (username === 'ADMIN' && password === 'ADMIN') {
            // We can store some flag in localStorage if needed, or handle admin session
            localStorage.setItem('isAdmin', 'true');
            navigate('/');
            return; 
        }

        const endpoint="/api/API_ENDPOINT_HERE"

        try {
            const response = await axios.post(endpoint, {
                username,
                password
            });
            
            // If the login is successful, you might receive a token or a success message
            if (response.status === 200) {
                // Perform any success actions like storing the token
                // localStorage.setItem('token', response.data.token);

                navigate('/');
            }
        } catch (error) {
            console.log("error");
            // Handle errors here, like incorrect username or password
            if (axios.isAxiosError(error) && error.response) {
                // The server responded with a status code outside the range of 2xx
                setError('Username or password is incorrect');
            } else {
                // An error occurred in setting up the request
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <Slideshow />
            <div className='login-box'>
                <h1>Welcome to Better Learning</h1>
                <div className='login-form'>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLoginClick}>Login</Button>
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
