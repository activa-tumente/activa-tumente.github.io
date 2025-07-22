export interface QuestionOption {
      value: string; // For internal use, like student ID
      label: string; // Display text
    }

    export interface Question {
      id: string;
      text: string;
      type: 'peer_selector' | 'checkbox_group_with_other' | 'single_choice';
      options?: string[] | QuestionOption[]; // Options for single_choice, checkbox_group. Peer selector gets options dynamically.
      maxSelections?: number; // Max peers for peer_selector
    }

    export const questionnaireQuestions: Question[] = [
      // Peer Selector Questions (Q1-10)
      {
        id: 'q1',
        text: '¿A quién elegirías como compañero/a de grupo de clase?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q2',
        text: '¿A quién NO elegirías como compañero/a?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q3',
        text: '¿Quiénes crees que te elegirían a ti?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q4',
        text: '¿Quiénes crees que NO te elegirían a ti?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q5',
        text: '¿Quiénes son los/as más fuertes de la clase?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q6',
        text: '¿Quiénes actúan como un/a cobarde o un bebé?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q7',
        text: '¿Quiénes maltratan o pegan a otros/as compañeros/as?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q8',
        text: '¿Quiénes suelen ser las víctimas?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q9',
        text: '¿Quiénes suelen empezar las peleas?',
        type: 'peer_selector',
        maxSelections: 3,
      },
      {
        id: 'q10',
        text: '¿A quiénes se les tiene manía?',
        type: 'peer_selector',
        maxSelections: 3,
      },

      // Checkbox Group with Other (Q11-12)
      {
        id: 'q11',
        text: 'Las agresiones suelen ser:',
        type: 'checkbox_group_with_other',
        options: ['Insultos y amenazas', 'Maltrato físico', 'Rechazo'],
      },
      {
        id: 'q12',
        text: '¿Dónde suelen ocurrir las agresiones?',
        type: 'checkbox_group_with_other',
        options: ['En el aula', 'En el patio', 'En los pasillos'],
      },

      // Single Choice Questions (Q13-15)
      {
        id: 'q13',
        text: '¿Con qué frecuencia ocurren las agresiones?',
        type: 'single_choice',
        options: ['Todos los días', '1-2 veces por semana', 'Rara vez', 'Nunca'],
      },
      {
        id: 'q14',
        text: '¿Crees que estas situaciones encierran gravedad?',
        type: 'single_choice',
        options: ['Poco o nada', 'Regular', 'Bastante', 'Mucho'],
      },
      {
        id: 'q15',
        text: '¿Te encuentras seguro/a en el centro escolar?',
        type: 'single_choice',
        options: ['Poco o nada', 'Regular', 'Bastante', 'Mucho'],
      },
    ];
