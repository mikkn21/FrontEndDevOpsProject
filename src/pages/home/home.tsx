import React, { useState } from 'react'; 
import './home.css';
import Navbar from '../../components/NavBar/navBar';
import AssignmentStatus from '../../components/AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../../components/Button/FileUploadButton';
import SubmitButton from '../../components/Button/SubmitButton';
import AssignmentCell from '../../components/AssignmentCell/assignmentCell';


const home: React.FC = () => {

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('NOT SUBMITTED'); 
    const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);


    const handleDataSubmit = (result: 'SUCCESS' | 'ERROR') => {
        setEvaluationStatus(result);
    };

    const handleFileUpload = (newStatus: string, uploadedFile: File) => {
        setStatus(newStatus);
        setFile(uploadedFile); // store file ID or token given from the Microservice to send to the Submit button
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
            {file && <SubmitButton
              fileReference={file.name}
              onDataSubmit={handleDataSubmit} 
              disabled={false}            
              />}
          </div>
        </div>
        {/* test section */}
        <hr style={{width:"100%", backgroundColor:"red", height:"5px", border: 'none'}}/>
        <div className = 'container'>
              <AssignmentCell AssignmentName={''}></AssignmentCell>
        </div>
      </div>
    );
}

export default home;