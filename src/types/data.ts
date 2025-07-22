// src/types/data.ts

// --- Existing Types ---

export interface Student {
  id: string; // Unique identifier for the student
  name: string; // Full name of the student
  age?: number; // Optional: Age of the student (Admin only)
  // Add any other relevant student details here
}

export interface Group {
  id: string; // Unique identifier for the group
  name: string; // Name of the group (e.g., "Class 5A")
  students: Student[]; // List of students in the group
}

// Represents a single answer to a question
export interface Answer {
  questionId: string; // Identifier of the question being answered
  value: any; // The actual answer value (could be string, number[], string[], etc.)
}

// Represents the complete set of answers for one student in one session
export interface QuestionnaireResponse {
  responseId: string; // Unique ID for this specific response submission
  groupId: string; // ID of the group the student belongs to
  studentId: string; // ID of the student who responded
  studentName: string; // Name of the student (for convenience)
  answers: Answer[]; // Array of answers
  submittedAt: string; // ISO timestamp of when the questionnaire was submitted
  // Optional: Add age group ('primary'/'secondary') if needed for analysis
  ageGroup?: 'primary' | 'secondary';
  // Optional: Add institution ID if responses need to be linked back directly
  institutionId?: string;
}


// --- NEW Type for Institution ---

export interface Institution {
  id: string;           // Unique identifier for the institution
  name: string;         // Name of the educational institution
  address?: string;      // Optional: Physical address
  contact?: string;      // Optional: Contact information (phone, email)
  groups: Group[];      // List of groups belonging to this institution
}

// You might also want a top-level structure if you store everything together,
// although the localStorageHelper is designed to handle an array of Institutions directly.
// Example (optional, depending on storage strategy):
/*
export interface AppData {
  institutions: Institution[];
  // Potentially other global settings or data
}
*/
