import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Button from "../../components/Button/Button";
import Slideshow from "../../components/SlideShow/slideShow";
import HashPass from "../../components/HashPass/passwordHash";
import RegisterModal from "../../components/RegisterModal/registerModal";
import { config } from "../../config";

type LoginResponse = {
  token: string;
  expires_in: number;
};

const loginResponse: LoginResponse = {
  token: "",
  expires_in: 0,
};

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
    setError("");

    // ADMIN login that can be used to bypass the authentication
    if (username === "ADMIN" && password === "ADMIN") {
      const role = "admin";
      const id = "12";
      const tokenValue = `${"authToken"}|${username}|${role}|${id}`;
      Object.assign(loginResponse, {
        token: tokenValue,
        expires_in: 1,
      });
      navigate("/");
      return;
    }

    // DUMMY DATA:
    // STUDENT login
    if (username === "student" && password === "student") {
      const role = "student";
      const iD = "123456";
      const tokenValue = `${"authToken"}|${username}|${role}|${iD}`;
      Object.assign(loginResponse, {
        token: tokenValue,
        expires_in: 1,
      });
      navigate("/");
      return;
    }

    // TEACHER login
    if (username === "teacher" && password === "teacher") {
      const role = "teacher";
      const id = "555";
      const tokenValue = `${"authToken"}|${username}|${role}|${id}`;
      Object.assign(loginResponse, {
        token: tokenValue,
        expires_in: 1,
      });
      navigate("/");
      return;
    }


    const endpoint = `${config.VITE_BACKEND_URL}/users/login`;

    // Get the hashed password to send to the backend
    const hashedPassword = await HashPass(password);

    const refreshToken = async () => {
      try {
        const response = await axios.post(endpoint, {
          username,
          hashedPassword,
        });

        if (response.status === 200 && response.data.token) {
          // Expires in should be reduced to the number of days? Which is fucked as we want to specify something like seconds.
          // can just be converted to 0.xx days?
          const initialLogin = loginResponse;
          const tokenValue = `${"authToken"}|${username}|${response.data.role}|${response.data.id}`;
          Object.assign(loginResponse, {
            token: tokenValue,
            expires_in: response.data.expires_in,
          });

          // if was not logged in at first, navigate the user
          if (initialLogin.token === "") {
            navigate("/");
          }
        }
      } catch (error) {
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
          setError("An unexpected error occurred. Please try again later.");
        }
      }
    };
    refreshToken();
    setInterval(refreshToken, 1000 * 60); // 10 minutes
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
            <div className="btn-row">
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

export { LoginPage, loginResponse };
