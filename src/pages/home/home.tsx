import React, { useState } from 'react'; 
import './home.css';
import Navbar from '../../components/NavBar/navBar';
import AssignmentStatus from '../../components/AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../../components/Button/FileUploadButton';
import SubmitButton from '../../components/Button/SubmitButton';
import AssignmentCell from '../../components/AssignmentCell/assignmentCell';
import AssignmentTable from '../../components/AssignmentTable/assignmentTable';

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
        <div className = 'container'>
              <AssignmentTable testMode={true} />
        </div>
      </div>
    );
}

export default home;