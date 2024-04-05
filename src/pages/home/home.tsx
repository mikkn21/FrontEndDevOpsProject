import React, { useState } from 'react'; 
import './home.css';
import Navbar from '../../components/NavBar/navBar';
import AssignmentStatus from '../../components/AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../../components/Button/FileUploadButton';
import SubmitButton from '../../components/Button/SubmitButton';


const home: React.FC = () => {

    const [fileReference, setFileReference] = useState<string | null>(null);
    const [status, setStatus] = useState('NOT SUBMITTED'); 
    const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);


    const handleDataSubmit = (result: 'SUCCESS' | 'ERROR') => {
        setEvaluationStatus(result);
    };

    const handleFileUpload = (newStatus: string, fileRef: string) => {
        setStatus(newStatus);
        setFileReference(fileRef); // store file ID or token given from the Microservice to send to the Submit button
    };


    return (
        <div>
        <Navbar />
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
              onDataSubmit={handleDataSubmit}
            />}
          </div>
        </div>
      </div>
    );
}

export default home;