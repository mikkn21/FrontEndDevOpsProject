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
  initialised: boolean;
  intervalId: NodeJS.Timeout | null;
};

const loginResponse: LoginResponse = {
  token: "",
  expires_in: 0,
  initialised: false,
  intervalId: null,
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
      const iD = "123456/";
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

    console.log(config);
    const endpoint = `${config.VITE_BACKEND_URL}/users/login`;

    // Get the hashed password to send to the backend
    const hashedPassword = await HashPass(password);

    const refreshToken = async (): Promise<number | undefined> => {
      try {
        console.log("BACKENDURL : ", endpoint);
        const response = await axios.post(endpoint, {
          name: username,
          password: hashedPassword,
        });
        console.log("Response : ", response);
        if (response.status === 200 && response.data.token) {
          const initialLogin = !loginResponse.initialised;
          const tokenValue = `${response.data.token}|${username}|${response.data.role}|${response.data.id}`;
          Object.assign(loginResponse, {
            token: tokenValue,
            expires_in: response.data.exp * 1000,
            initialised: true,
          });

          console.log("loginResponse : ", loginResponse);
          console.log("initialLogin : ", initialLogin);
          console.log("is initial login token empty : ", initialLogin);
          // if was not logged in at first, navigate the user
          if (initialLogin) {
            navigate("/");
            return response.data.exp * 1000;
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
    const exp = await refreshToken();
    if (exp && !loginResponse.intervalId) {
      const id = setInterval(refreshToken, exp);
      loginResponse.intervalId = id;
    }
  };

  return (
    <div className="login-container">
      <Slideshow />
      {showRegisterModal ? (
        <RegisterModal onClose={handleHideRegisterModal} />
      ) : (
        <div className="login-box">
          <h1>Welcome to Better Learning, this is a new version!</h1>
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
