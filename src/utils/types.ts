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
    status: 'NOT SUBMITTED' | 'SUBMITTED' | 'ERROR'; // whether or not the student has submitted the assignment
    // TODO: Add a loading status 
    evaluationStatus: 'SUCCESS' | 'ERROR' | null; // status of the evaluation of the submission (failed or succeeded to be evaluated) 
    output?: string; // For storing the output of the evaluation
    result?: string; 
    // other properties...
  }


export interface Student {
    id: string; // Assuming IDs are strings
    name: string;
}