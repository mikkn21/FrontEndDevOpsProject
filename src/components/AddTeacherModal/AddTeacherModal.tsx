import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HashPassword from '../HashPass/passwordHash';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch' as const, // Ensuring strict typing
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'
    }
};

interface AddTeacherModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onRequestClose }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{ message: string } | null>(null);
    
    const baseEndpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint


    const handleRegistration = async () => {
        // Get the hashed password to send to the backend
        const hashedPassword = await HashPassword(password);

        try {
        const response = await axios.post('baseEndpoint/create/teacher', {
            username,
            hashedPassword,
        });
        } catch (error) {
            console.log("OTHER STUFF");
            setError({ message: "An error occurred. Please try again later." });
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
            { error && <p className='error'>Error: {error.message}</p> }
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
                    <button type="submit" onClick={handleRegistration}>Register</button>
                    <button onClick={handleClose}>Close</button>  
                </div>
            </div>
            
        </Modal>
    );
}; 

export default AddTeacherModal;
