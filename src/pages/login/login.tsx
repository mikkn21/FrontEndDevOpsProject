import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Cookies from "js-cookie";
import Button from "../../components/Button/Button";
import Slideshow from "../../components/SlideShow/slideShow";
import HashPass from "../../components/HashPass/passwordHash";
import RegisterModal from "../../components/Register/registerModal";


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);


  const handleShowRegisterModal = () => setShowRegisterModal(true);
  const handleHideRegisterModal = () => setShowRegisterModal(false);



  const handleLoginClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log("Login clicked");
    setError("");

    // ADMIN login that can be used to bypass the authentication
    if (username == "ADMIN" && password == "ADMIN") {
      const adminTokenValue = `adminToken|${username}`;
      Cookies.set("adminToken", adminTokenValue, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      navigate("/");
      return;
    }

    const endpoint = "/login/authentication";

    // Get the hashed password to send to the backend
    const hashedPassword = await HashPass(password);

    try {
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
        navigate("/");
      }
    } catch (error) {
      console.log("hello");
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
        console.log("Non-Axios error:", error);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

   return (
    <div className="login-container">
      <Slideshow />
      {showRegisterModal ? (
        <RegisterModal onClose={handleHideRegisterModal} />
      ) : (
        <div className="login-box">
          <h1>Welcome to Better Learning</h1>
          <div className="login-form">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className='btn-row'>
              <Button onClick={handleLoginClick}>Login</Button>
              <Button onClick={handleShowRegisterModal}>Register</Button>
            </div>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
