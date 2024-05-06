import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './inputModal.css';
import Button from '../Button/Button';
import axios from "axios";
import FileUploadButton from '../Button/FileUploadButton';
import fileIcon from '../../assets/icons8-file.svg'


interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: { name: string; dueDate: string }) => void;
    testMode?: boolean;
}

interface Student {
    id: string; // Assuming IDs are strings
    name: string;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSave, testMode=false}) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    
    const endpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint

    // call to backend to send the new assignment
    const handleSubmit = async () => {
        if (testMode) {
            onSave({ name, dueDate });
            onClose();
        } else {
            try {
                setLoading(true);
                const assignmentData = {
                    name: name,
                    selectedStudents: selectedStudents,
                    dueDate: dueDate,
                    file: file
                };
                const response = await axios.post(endpoint, assignmentData);
                // not sure if we need to use the response for a anything
                onSave({ name, dueDate });
                onClose();
            } catch (error) {
                setError({ message: 'Failed to create the assignment. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStudentSelection = (selectedOptions: any) => {
        const selectedStudentIds = selectedOptions.map((option: any) => option.value);
        setSelectedStudents(selectedStudentIds);
    };

    const handleFileUpload = (newStatus: string, uploadedFile: File) => {
        setFile(uploadedFile);
      };
  
      const handleFileRemove = () => {
        setFile(null);
      };


    if (!isOpen) return null;


   //backend call to get students
    useEffect(() => {
        if (testMode) {
            // Dummy test data
            setStudents([
                { id: '1', name: 'Alice Smith' },
                { id: '2', name: 'Bob Johnson' },
                { id: '3', name: 'Carol Williams' },
                { id: '4', name: 'Dave Jones' },
                { id: '5', name: 'Eve Brown' }
            ]);
            setLoading(false);
        } else {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(endpoint);
                    setStudents(response.data); 
                  
                } catch (error) {
                    console.error('Failed to fetch students:', error);
                    setError({message : 'Failed to load students. Please try again.'});
                }
                setLoading(false);
            };
            if (isOpen) {
                fetchStudents();
            }
        }
    }, [isOpen, testMode]);
    

    return (
        <div className="modal">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error.message}</p>
            ) : (
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Create New Assignment</h2>
                    <input
                        type="text"
                        placeholder="Assignment Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className="student-list">
                        <Select 
                            options={students.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                            isMulti
                            placeholder='Select students...'
                            onChange={handleStudentSelection}
                            value={selectedStudents.map(studentId => ({
                                value: studentId,
                                label: students.find(student => student.id === studentId)?.name || ''
                            }))}
                        />
                    </div>
                    <div className='date-row'>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className='file-row'>
                        {file ? (
                        <div className='file-info'>
                            <img src={fileIcon} alt="file type" className="file-icon" />
                            <p>{file.name}</p>
                            <div className='remove-file' onClick={handleFileRemove}>&times;</div>
                        </div>
                         ) : null}
                         <div className='control-btn'>
                            <FileUploadButton 
                                onFileUploadStatus={handleFileUpload}
                            />
                            <Button onClick={handleSubmit}>Save</Button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    )};

export default InputModal;
