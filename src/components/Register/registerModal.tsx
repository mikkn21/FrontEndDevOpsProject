import React, { useState } from 'react';
import './registerModal.css'
import Button from "../Button/Button";
import axios from "axios";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";
import HashPass from "../../components/HashPass/passwordHash";

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    // Implement registration logic here
    // For example, API call to thebackend to create a new user
    console.log("Registering", { username, password});
    setError("");

    const endpoint = "/api/register";

    // Get the hashed password to send to the backend
    const hashedPassword = await HashPass(password);
    
    try {
      console.log("BEFORE ERROR");
      const response = await axios.post(endpoint, {
        username,
        hashedPassword,
      });

      if (response.status === 200 && response.data.token) {
        // Expires in should be reduced to the number of days? Which is fucked as we want to specify something like seconds.
        // can just be converted to 0.xx days?
        Cookies.set("token", response.data.token, {
          expires: response.data.expires_in,
          secure: true,
          sameSite: "strict",
        });
        // Close the modal upon successful registration
        onClose();
        navigate("/");
      }
    } catch (error) {
      console.log("OTHER STUFF");
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          // Handle Bad Request
          setError("try again something went wrong");
        } else if (status === 404) {
          // Handle Not Found
          setError("invalid username or password");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        // Handle non-Axios errors
        console.log("ERROR HERE");
        setError("An unexpected error occurred. Please try again later.");
      }
    } 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Register as a student</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleRegistration(); }}>
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
          <div className="modal-buttons">
            <Button type="submit">Register</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterModal;


