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


export interface Student {
    id: string; // Assuming IDs are strings
    name: string;
}