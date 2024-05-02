import React, { useState } from 'react';
import './inputModal.css';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: { name: string; dueDate: string }) => void;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = () => {
        onSave({ name, dueDate });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create New Assignment</h2>
                <input
                    type="text"
                    placeholder="Assignment Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
};

export default InputModal;
