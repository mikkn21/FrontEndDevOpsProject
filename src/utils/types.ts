export interface Assignment {
    id: number;
    name: string;
    dueDate: string;
    selectedStudents?: Student[]; 
    file?: File;
    isPaused?: boolean;
    // other properties...
  }


export interface Student {
    id: string; // Assuming IDs are strings
    name: string;
}