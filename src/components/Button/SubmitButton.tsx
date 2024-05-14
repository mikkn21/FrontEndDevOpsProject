import React from 'react';
import Button from './Button';

interface SubmitButtonProps {
    onClick: () => void;  
    disabled?: boolean;
    loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, loading }) => {
    return (
        <Button onClick={onClick} disabled={disabled || loading}>
           {loading ? 'Loading...' : 'Submit'}
        </Button>
    );
};

export default SubmitButton;