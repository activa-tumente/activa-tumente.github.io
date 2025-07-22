// src/lib/localStorageHelper.ts

// --- Interfaces (Asegúrate de que estén definidas aquí o importadas) ---
export interface Student {
  id: string;
  name: string;
  age?: number;
}

export interface Group {
  id: string;
  name: string;
  students: Student[];
}

export interface Institution {
  id: string;
  name: string;
  address?: string;
  contact?: string;
  groups: Group[];
}

// --- Clave para LocalStorage (Buena práctica definirla como constante) ---
const INSTITUTIONS_STORAGE_KEY = 'educationalInstitutions';
const RESPONSES_STORAGE_KEY = 'questionnaireResponses'; // Key for responses




// --- Funciones para Instituciones ---
export const saveInstitutions = (institutions: Institution[]): void => {
  try {
    localStorage.setItem(INSTITUTIONS_STORAGE_KEY, JSON.stringify(institutions));
  } catch (error) {
    console.error("Error saving institutions to localStorage:", error);
    throw new Error("Failed to save institution data");
  }
};

export const getInstitutions = (): Institution[] => {
  try {
    const storedData = localStorage.getItem(INSTITUTIONS_STORAGE_KEY);
    if (storedData) {
      const institutions: Institution[] = JSON.parse(storedData);
      return institutions;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting institutions from localStorage:", error);
    return [];
  }
};

// --- NEW: Función para obtener una institución por su ID ---
export const getInstitutionById = (institutionId: string): Institution | undefined => {
  try {
    const institutions = getInstitutions();
    return institutions.find(inst => inst.id === institutionId);
  } catch (error) {
    console.error(`Error getting institution by ID (${institutionId}):`, error);
    return undefined; // Return undefined on error
  }
};


// --- Funciones para Grupos y Estudiantes ---

// Obtener un grupo específico por su ID (buscando en todas las instituciones)
export const getGroupById = (groupId: string): Group | undefined => {
  try {
    const institutions = getInstitutions();
    for (const institution of institutions) {
      const group = institution.groups?.find(g => g.id === groupId);
      if (group) {
        return group;
      }
    }
    return undefined; // Not found
  } catch (error) {
    console.error(`Error getting group by ID (${groupId}):`, error);
    return undefined;
  }
};

// Obtener todos los estudiantes de un grupo específico
export const getStudentsByGroupId = (groupId: string): Student[] => {
  try {
    const group = getGroupById(groupId);
    return group?.students || [];
  } catch (error) {
    console.error(`Error getting students for group ID (${groupId}):`, error);
    return [];
  }
};

// Obtener un estudiante específico por su ID dentro de un grupo
export const getStudentById = (groupId: string, studentId: string): Student | undefined => {
  try {
    const students = getStudentsByGroupId(groupId);
    return students.find(s => s.id === studentId);
  } catch (error) {
    console.error(`Error getting student by ID (${studentId}) in group (${groupId}):`, error);
    return undefined;
  }
};


// --- Funciones para Respuestas del Cuestionario ---
// Import QuestionnaireResponse type if not already defined here
import type { QuestionnaireResponse } from '../types/data';

// Guardar una respuesta
export const saveResponse = (response: QuestionnaireResponse): void => {
  try {
    const existingResponses = getResponses();
    const updatedResponses = [...existingResponses, response];
    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(updatedResponses));
  } catch (error) {
    console.error("Error saving questionnaire response:", error);
    throw new Error("Failed to save response data");
  }
};

// Obtener todas las respuestas
export const getResponses = (): QuestionnaireResponse[] => {
  try {
    const storedData = localStorage.getItem(RESPONSES_STORAGE_KEY);
    if (storedData) {
      const responses: QuestionnaireResponse[] = JSON.parse(storedData);
      return responses;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting questionnaire responses:", error);
    return [];
  }
};

// Obtener la respuesta de un estudiante específico (si existe)
export const getResponseForStudent = (groupId: string, studentId: string): QuestionnaireResponse | undefined => {
  try {
    const responses = getResponses();
    return responses.find(r => r.groupId === groupId && r.studentId === studentId);
  } catch (error) {
    console.error(`Error getting response for student (${studentId}) in group (${groupId}):`, error);
    return undefined;
  }
};


// --- Opcional: Función para limpiar todos los datos ---
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(INSTITUTIONS_STORAGE_KEY);
    localStorage.removeItem(RESPONSES_STORAGE_KEY);
    console.log('All application data cleared from localStorage.');
  } catch (error) {
    console.error("Error clearing all data from localStorage:", error);
  }
};
