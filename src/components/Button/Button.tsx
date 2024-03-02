import React from 'react';
import './Button.css'; 

interface ButtonProps {
    children: React.ReactNode; // Content inside the button
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;   
    type?: 'button' | 'submit' | 'reset'; // Default is 'button'
    disabled?: boolean;       
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className="btn"
        >
            {children}
        </button>
    );
};

export default Button;