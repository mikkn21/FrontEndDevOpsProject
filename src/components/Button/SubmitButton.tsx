import React from 'react';
import axios from 'axios';
import Button from './Button';

interface SubmitButtonProps {
  fileReference: string;  // Maybe this is a ID or token given back when the FileUploadButton have called its microservice
  onDataSubmit: (result: 'SUCCESS' | 'ERROR') => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ fileReference, onDataSubmit }) => {
    const handleEvaluation = () => {
        const evaluationEndpoint = `EVALUATION_SERVICE_ENDPOINT/${fileReference}`;

         axios.post(evaluationEndpoint, { /* If we need to send additional data */ })
            .then(response => {
            console.log('Evaluation successful', response.data);
            onDataSubmit('SUCCESS');
            })
            .catch(error => {
            console.error('Evaluation failed', error);
            onDataSubmit('ERROR');
            });
    };
  
    return (
      <Button onClick={handleEvaluation}>
        Submit
      </Button>
    );
  };
  
  export default SubmitButton;