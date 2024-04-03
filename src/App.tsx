import React, { useEffect, useState } from 'react';
import FileUploadButton from './components/Button/FileUploadButton'; 
import SubmitButton from './components/Button/SubmitButton'; 
import ProtectedRoute from './components/ProtectedRoute/protectedRoute';
import AssignmentStatus from './components/AssignmentStatus/AssignmentStatus';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/login'; 
import Navbar from './components/NavBar/navBar';
import Page1 from './pages/page1/page1'; 
import Page2 from './pages/Page2/page2';

import './App.css'; 

const App: React.FC = () => {
  useEffect(() => {
    document.title = "Better Learning"; 
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
    <BrowserRouter>
      <Routes>
        {/* Login page route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main page route, which is protected i.e., you need to be logged in to view */}
        <Route path="/" element={
        <ProtectedRoute requireAdmin={false} element={
          /* Main page might need to be its own page also */
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
        }/>
      }/>
      <Route path="/p1" element= {
        <ProtectedRoute requireAdmin={false} element={<Page1 />}/>
      }/>
       <Route path="/p2" element= {
        <ProtectedRoute requireAdmin={false} element={<Page2 />}/>
      }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;