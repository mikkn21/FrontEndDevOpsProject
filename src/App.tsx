import React, { useEffect, useState } from 'react';
import FileUploadButton from './components/Button/FileUploadButton'; 
import SubmitButton from './components/Button/SubmitButton'; 
import AssignmentStatus from './components/AssignmentStatus/AssignmentStatus';


import './App.css'; 

const App: React.FC = () => {
  useEffect(() => {
    document.title = "WIP title"; 
  }, []);

  const [fileReference, setFileReference] = useState<string | null>(null);
  const [status, setStatus] = useState('NOT SUBMITTED'); 
  const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);


  const handleFileUpload = (newStatus: string, fileRef: string) => {
    setStatus(newStatus);
    setFileReference(fileRef); // store file ID or token given from the Microservice to send to the Submit button
  };

  const handleDataSubmit = (result: 'SUCCESS' | 'ERROR') => {
    setEvaluationStatus(result);
  };


  return (
    <div>
      <div className='container'>
        <h1>Hello, world!</h1>
      </div>   
      <div className='ui'>
        <div>
        <AssignmentStatus status={status} evaluationStatus={evaluationStatus} />
        </div>
        <div className='panel'>
         <FileUploadButton onFileUploadStatus={handleFileUpload}/>
          {fileReference && <SubmitButton
            fileReference={fileReference}
            onDataSubmit={handleDataSubmit} // We don't show the submit button unless we know a file was sucesfully submitted.
          />}
        </div>
      </div>
    </div>
  );
};

export default App;