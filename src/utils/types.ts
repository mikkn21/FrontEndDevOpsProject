export type Assignment = {
    id: number;
    name: string;
    teacher: string;
    selectedStudents?: Person[]; 
    dueDate: Date;
    file?: File;
    isPaused?: boolean;
    visible: boolean;
    maxTime: number;
    maxMem: number;
    vCpu: number;
    maxSubmissions: number;
    StudentSubmissions: Submission[];
  }

  export type Submission = {
    id: number;
    studentId: string;
    studentName: string;
    file: File;
    evaluationStatus: 'SUCCESS' | 'ERROR' | 'STOPPED' | 'LOADING' | 'PAUSED'  | 'CANCELLED' | null; 
    log?: string; // For storing the logs.txt file
    result?: string; // for storing the result.txt file
  }

export type Person = {
  id: string;
  name: string;
  role: Role;
  status?: Status;
}


export enum Status { 
  ACTIVE = 'active',
  PAUSED = 'paused',
}

export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

