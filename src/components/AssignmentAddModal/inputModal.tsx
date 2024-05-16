import React, { useState, useEffect } from 'react';
import Select, {MultiValue} from 'react-select';
import './inputModal.css';
import Button from '../Button/Button';
import axios from "axios";
import FileUploadButton from '../Button/FileUploadButton';
import fileIcon from '../../assets/icons8-file.svg'
import { Person, Role, Status } from '../../utils/types';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: { 
        name: string;
        dueDate: Date;
        selectedStudents: Person[];
        file?: File;
        visible: boolean;
        maxTime: number;
        maxMem: number;
        vCpu: number;
        maxSubmissions: number;
    }) => void;  
    testMode?: boolean;
}



const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSave, testMode=false}) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [students, setStudents] = useState<Person[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Person[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [visible, setVisible] = useState(true); // Default to true
    const [maxTime, setMaxTime] = useState(0); // Default to 0
    const [maxMem, setmaxMem] = useState(0); // Default to 0
    const [vCpu, setVCpu] = useState(0); // Default to 0
    const [maxSubmissions, setMaxSubmissions] = useState(2); // Default to 2
    
    const endpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint

    // call to backend to send the new assignment
    const handleSubmit = async () => {
        if (testMode) {
            onSave({
                name,
                dueDate: new Date(dueDate),
                selectedStudents,
                visible, 
                maxTime,  
                maxMem, 
                vCpu, 
                maxSubmissions, 
                ...(file && { file })  // Only include file if it's not null
                });
            onClose();
        } else {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('name', name);
                formData.append('dueDate', dueDate);
                formData.append('visible', String(visible));
                formData.append('maxTime', String(maxTime));
                formData.append('maxMem', String(maxMem));
                formData.append('vCpu', String(vCpu));
                formData.append('maxAttempts', String(maxSubmissions));
                formData.append('selectedStudents', JSON.stringify(selectedStudents.map(student => student.id)));
                if (file) formData.append('file', file);
                
                // TODO: Find out if response needs to be used for anything
                // const response = await axios.post(endpoint, formData, {
                //     headers: { 'Content-Type': 'multipart/form-data' }
                // });
               await axios.post(endpoint, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                onSave({
                    name,
                    dueDate: new Date(dueDate),
                    selectedStudents,
                    visible,
                    maxTime,
                    maxMem,
                    vCpu,
                    maxSubmissions,
                    ...(file && { file })
                  });
                onClose();
            } catch (error) {
                setError({ message: 'Failed to create the assignment. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStudentSelection = (
        selectedOptions: MultiValue<{ value: string; label: string; }>, 
    ) => {
        if (!selectedOptions) {
            setSelectedStudents([]);
            return;
        }
        const selectedStudents = selectedOptions.map(option => students.find(student => student.id === option.value && student.role == Role.STUDENT )).filter((student): student is Person => student !== undefined);
        setSelectedStudents(selectedStudents);
    };

    const handleFileUpload = (uploadedFile: File) => {
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
                { id: '1', name: 'Alice Smith', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '2', name: 'Bob Johnson', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '3', name: 'Carol Williams', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '4', name: 'Dave Jones', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '5', name: 'Eve Brown', role: Role.STUDENT, status: Status.ACTIVE},
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
                    <div className='data-entry'>
                        <div className='data-row'>
                            <label>Assignment Name</label>
                            <input
                                type="text"
                                placeholder="Assignment Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Visibility: </label>
                            <input 
                                type="checkbox"
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max Time: </label>
                            <input
                                type="number"
                                placeholder="Max Time"
                                value={maxTime}
                                onChange={(e) => setMaxTime(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max Memory: </label>
                            <input
                                type="number"
                                placeholder="Max Memory "
                                value={maxMem}
                                onChange={(e) => setmaxMem(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>VCPU: </label>
                            <input
                                type="number"
                                placeholder="number of vCPU"
                                value={vCpu}
                                onChange={(e) => setVCpu(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max submissions for each student: </label>
                            <input
                                type="number"
                                placeholder="maximum number of assignment submissions"
                                value={maxSubmissions}
                                onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                                min={1}
                                max={3}
                            />
                        </div>
                    </div>
                    <div className="student-list">
                        <Select 
                            options={students.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                            isMulti
                            placeholder='Select students...'
                            onChange={handleStudentSelection}
                            value={selectedStudents.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                        />
                    </div>
                    <div className='date-row'>
                        <label>Due date: </label>
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
