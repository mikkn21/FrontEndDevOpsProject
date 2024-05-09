import { Submission } from './types'; 

export const convertToCSV = (submissions: Submission[]): string => {
    // This is all the metaData found in the Submission type in types.ts
    const headers = [
        "ID",
        "Student ID",
        "Student Name",
        "Status",
        "Evaluation Status",
        "Result",
        "Output"
    ];
    const rows = submissions.map(sub => [
        sub.id.toString(),
        sub.studentId,
        sub.studentName,
        sub.status,
        sub.evaluationStatus || "", // Handling null by converting it to an empty string
        sub.result || "", // Handle undefined by using an empty string
        sub.log || "" // Handle undefined by using an empty string
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
};

export const downloadCSV = (csvString: string, filename: string): void => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

