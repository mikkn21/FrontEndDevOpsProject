import Modal from "react-modal";
import React, { useState } from "react";
import axios from "axios";
import HashPassword from "../HashPass/passwordHash";
import { Person, Role } from "../../utils/types";
import { config } from "../../config";
import { loginResponse } from "../../pages/login/login";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch" as const, // Ensuring strict typing
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
  },
};

interface AddTeacherModalProps {
  isOpen: boolean;
  testMode: boolean;
  onRequestClose: () => void;
  onAddTeacher: (newTeacher: Person) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  testMode = false,
  onRequestClose,
  onAddTeacher,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ message: string } | null>(null);

  const baseEndpoint = `${config.VITE_BACKEND_URL}/users`; // Adjust URL to your actual API endpoint

  const handleRegistration = async () => {
    if (testMode) {
      // If in test mode, add a teacher with a random ID
      const newTeacher = {
        id: Math.random().toString(),
        name: username,
        role: Role.TEACHER,
      };
      onAddTeacher(newTeacher);
      onRequestClose();
    } else {
      // Get the hashed password to send to the backend
      const hashedPassword = await HashPassword(password);

      try {
        const response = await axios.post(
          `${baseEndpoint}/addUser`,
          {
            name: username,
            password: hashedPassword,
            role: Role.TEACHER,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authentication: loginResponse.token.split("|")[0],
            },
          }
        );
        if (response.data) {
          // Assume the response is the new teacher as a Person object
          // i.e., { id: string, name: string, role: Role }
          onAddTeacher(response.data);
          onRequestClose();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (
              error.response.status === 400 &&
              error.response.data.error === "User already exists"
            ) {
              setError({
                message:
                  "Username already exists. Please choose a different one.",
              });
              return;
            }
          }
        } else {
          setError({ message: "An error occurred. Please try again later." });
        }
      }
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError(null);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add Teacher Modal"
    >
      <h2>Add Teacher</h2>
      {error && <p className="error">Error: {error.message}</p>}
      <div>
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
          <button type="submit" onClick={handleRegistration}>
            Register
          </button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeacherModal;
