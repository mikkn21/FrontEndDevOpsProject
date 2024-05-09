export interface Assignment {
    id: number;
    name: string;
    dueDate: string;
    selectedStudents?: Student[]; 
    file?: File;
    isPaused?: boolean;
    visible: boolean;
    maxTime: number;
    maxMem: number;
    vCpu: number;
    // other properties...
  }

  export interface Submission {
    id: number;
    studentId: string;
    studentName: string;
    file: File | undefined;
    status: 'NOT SUBMITTED' | 'SUBMITTED' | 'ERROR' | 'STOPPED'; // whether or not the student has submitted the assignment
    // TODO: Add a loading status 
    evaluationStatus: 'SUCCESS' | 'ERROR' | 'STOPPED' | null; // status of the evaluation of the submission (failed or succeeded to be evaluated) 
    log?: string; // For storing the logs.txt file
    result?: string; // for storing the result.txt file
    // other properties...
  }


export interface Student {
    id: string; // Assuming IDs are strings
    name: string;
}