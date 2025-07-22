/**
 * Datos locales de estudiantes para autenticación y cuestionario
 * Estos datos se utilizan cuando no hay conexión a Supabase
 */

export const studentData = {
  // Mapa de grados con sus IDs
  grades: [
    { id: 'grade-6B', nombre: '6B', grado: '6B' },
    { id: 'grade-8A', nombre: '8A', grado: '8A' },
    { id: 'grade-8B', nombre: '8B', grado: '8B' }
  ],
  
  // Estudiantes organizados por grado
  students: {
    '6B': [
      { id: '6B-01', name: 'VICTORIA AGUILAR BECERRA', documento: '1097122645', edad: 11 },
      { id: '6B-02', name: 'JUAN JOSÉ ALVAREZ MANTILLA', documento: '1221463877', edad: 12 },
      { id: '6B-03', name: 'MARIA PAULA AMAYA MARTINEZ', documento: '1097201651', edad: 11 },
      { id: '6B-04', name: 'SAMUEL CAMILO ARIAS PALOMO', documento: '1099424867', edad: 12 },
      { id: '6B-05', name: 'JUAN MANUEL AVENDAÑO CANO', documento: '1029523359', edad: 10 },
      { id: '6B-06', name: 'THALIANA BALLESTEROS GARCIA', documento: '1066883422', edad: 12 },
      { id: '6B-07', name: 'JOSE ALIRIO CALDERON GRIMALDOS', documento: '1097121199', edad: 11 },
      { id: '6B-08', name: 'DANIEL FELIPE CARDONA PATERNINA', documento: '1097200716', edad: 11 },
      { id: '6B-09', name: 'MIA CARDOZO FABRE', documento: '1097121229', edad: 11 },
      { id: '6B-10', name: 'MARIA PAULA CARVAJAL CASTELLANOS', documento: '1096073026', edad: 10 },
      { id: '6B-11', name: 'HECTOR MANUEL FORERO MENESES', documento: '1097789728', edad: 12 },
      { id: '6B-12', name: 'SANTIAGO ELIAS GONZALEZ LARIOS', documento: '1205964055', edad: 11 },
      { id: '6B-13', name: 'LUCIANA GONZALEZ SILVA', documento: '1222118267', edad: 11 },
      { id: '6B-14', name: 'ISABELA LEON DIAZ', documento: '1097789761', edad: 12 },
      { id: '6B-15', name: 'JUAN JOSE MARTIN ARAQUE', documento: '1028875934', edad: 11 },
      { id: '6B-16', name: 'ANNIE SOFIA MENDEZ LOZADA', documento: '1097123049', edad: 11 },
      { id: '6B-17', name: 'ISABELLA MORENO MONTOYA', documento: '1097790737', edad: 11 },
      { id: '6B-18', name: 'DAGO SAMUEL NIÑO ORTIZ', documento: '1098077749', edad: 11 },
      { id: '6B-19', name: 'VALERIA ORTIZ PEREZ', documento: '1030193561', edad: 11 },
      { id: '6B-20', name: 'RICARDO PAEZ VALBUENA', documento: '1014885370', edad: 11 },
      { id: '6B-21', name: 'JUAN GUILLERMO RESTREPO VARGAS', documento: '1097122694', edad: 11 },
      { id: '6B-22', name: 'LUIS ALEJANDRO RODRIGUEZ PINTO', documento: '1097120696', edad: 12 },
      { id: '6B-23', name: 'FELIX DAVID SIERRA MIRANDA', documento: '1020229816', edad: 12 },
      { id: '6B-24', name: 'MARIA FERNANDA SUÁREZ AVAUNZA', documento: '1222303739', edad: 11 },
      { id: '6B-25', name: 'JUAN PABLO VECINO PEREZ', documento: '1097120107', edad: 12 }
    ],
    '8A': [
      { id: '8A-01', name: 'THANYA SOPHIE ACEVEDO GRANADOS', documento: '1097113083', edad: 13 },
      { id: '8A-02', name: 'MARIA ALEJANDRA AMAYA MARTINEZ', documento: '1097197548', edad: 13 },
      { id: '8A-03', name: 'LAUREN SOFIA ANZOLA GONZALEZ', documento: '1124825116', edad: 13 },
      { id: '8A-04', name: 'ANDRÉS GUSTAVO BUSTAMANTE SEPULVEDA', documento: '1097787744', edad: 14 },
      { id: '8A-05', name: 'MANUELA CARO BARRERA', documento: '1097505483', edad: 13 },
      { id: '8A-06', name: 'JUAN ANGEL CARRASCAL DAZA', documento: '1046708952', edad: 14 },
      { id: '8A-07', name: 'DANNA CARVAJAL URIBE', documento: '1011213038', edad: 13 },
      { id: '8A-08', name: 'JUAN JOSE CASTAÑEDA PORRAS', documento: '1014879888', edad: 13 },
      { id: '8A-09', name: 'SOFIA CASTELLANOS WILCHES', documento: '1099744366', edad: 14 },
      { id: '8A-10', name: 'MARIA ISABELLA DAVILA LOPEZ', documento: '1097504256', edad: 14 },
      { id: '8A-11', name: 'FABIAN EDUARDO DIAZ BALCARCEL', documento: '1097787545', edad: 14 },
      { id: '8A-12', name: 'LISETH GABRIELA DIAZ NIÑO', documento: '1097504567', edad: 13 },
      { id: '8A-13', name: 'ABIGAIL GARCIA ALVAREZ', documento: '1098075012', edad: 15 },
      { id: '8A-14', name: 'JAVIER ALEJANDRO GOMEZ GONZALEZ', documento: '1096703562', edad: 13 },
      { id: '8A-15', name: 'ALEJANDRO GOMEZ TORRES', documento: '1097505963', edad: 12 },
      { id: '8A-16', name: 'SALOME HERNANDEZ VARGAS', documento: '1101624282', edad: 13 },
      { id: '8A-17', name: 'JOSHUA JAVIER MAYORGA SOPÓ', documento: '1022382221', edad: 14 },
      { id: '8A-18', name: 'SANTIAGO IMAD NAJM SASSINE', documento: '1097503495', edad: 14 },
      { id: '8A-19', name: 'DANA NAVARRETE LAGOS', documento: '1011105873', edad: 13 },
      { id: '8A-20', name: 'TOMÁS ALEJANDRO NOVA BECERRA', documento: '1030181390', edad: 14 },
      { id: '8A-21', name: 'JUAN PABLO PARADA ROMERO', documento: '1082966320', edad: 14 },
      { id: '8A-22', name: 'MARIA JOSE RIOS CACERES', documento: '1098075935', edad: 14 },
      { id: '8A-23', name: 'JULIANA DE DIOS RODRIGUEZ REYES', documento: '1098075606', edad: 14 },
      { id: '8A-24', name: 'ISABELLA ROMAN SERRANO', documento: '1097114913', edad: 13 },
      { id: '8A-25', name: 'JUAN JOSE SANCHEZ MURILLO', documento: '1097504236', edad: 14 },
      { id: '8A-26', name: 'LAURA JOHANA SANDOVAL SEPULVEDA', documento: '1097112005', edad: 14 },
      { id: '8A-27', name: 'SUSANA ISABEL SOTO TOVAR', documento: '1042860515', edad: 14 },
      { id: '8A-28', name: 'LUKAS MATEO URIBE HIGUITA', documento: '1142719203', edad: 13 },
      { id: '8A-29', name: 'DANNA GABRIELA VARGAS JAIMES', documento: '1142718531', edad: 14 },
      { id: '8A-30', name: 'KEVIN SPENCER VEGA ALDANA', documento: '1097505378', edad: 13 }
    ],
    '8B': [
      { id: '8B-01', name: 'DANIEL ESTEBAN AREVALO BRAVO', documento: '1188214165', edad: 14 },
      { id: '8B-02', name: 'THOMAS JOSE BLANCO SAAVEDRA', documento: '1097109535', edad: 14 },
      { id: '8B-03', name: 'SAUL ANDRES BOBADILLA SANCHEZ', documento: '1096071330', edad: 13 },
      { id: '8B-04', name: 'MATILDE ISABEL BOHÓRQUEZ FORERO', documento: '1010843531', edad: 13 },
      { id: '8B-05', name: 'SAMUEL ARTURO CASTRO MARTINEZ', documento: '1095313087', edad: 13 },
      { id: '8B-06', name: 'MARIA JOSE DUARTE MORALES', documento: '1098750506', edad: 13 },
      { id: '8B-07', name: 'SANTIAGO ESPITIA GALVÁN', documento: '1097109128', edad: 14 },
      { id: '8B-08', name: 'MARY FORERO MENESES', documento: '1097787577', edad: 14 },
      { id: '8B-09', name: 'JUAN JOSE GOMEZ VEGA', documento: '1097914859', edad: 14 },
      { id: '8B-10', name: 'ANDRES FELIPE GONZALEZ ARGUELLO', documento: '1101692231', edad: 13 },
      { id: '8B-11', name: 'MARIANA LADINO GIRALDO', documento: '1027285487', edad: 14 },
      { id: '8B-12', name: 'JOSEPH EMMANUEL MANTILLA MENDEZ', documento: '1142719351', edad: 13 },
      { id: '8B-13', name: 'STEBAN MEJIA CORREDOR', documento: '1097505777', edad: 12 },
      { id: '8B-14', name: 'DIEGO ALEJANDRO ORTIZ LANDAZURI', documento: '1097113800', edad: 13 },
      { id: '8B-15', name: 'ANDRES SEBASTIAN PARDO ARAQUE', documento: '1097788675', edad: 13 },
      { id: '8B-16', name: 'JOSE ALEJANDRO PATIÑO CARDENAS', documento: '1097114337', edad: 13 },
      { id: '8B-17', name: 'FELIPE PEDRAZA ZAPATA', documento: '1096070055', edad: 14 },
      { id: '8B-18', name: 'KIARA ALEJANDRA PINEDA SANTOS', documento: '1097788294', edad: 13 },
      { id: '8B-19', name: 'JUAN FELIPE RANGEL RUEDA', documento: '1097504065', edad: 14 },
      { id: '8B-20', name: 'MARIA SALOME REYES ARDILA', documento: '1100962480', edad: 14 },
      { id: '8B-21', name: 'SAMUEL FELIPE RUEDA LOZANO', documento: '1097787185', edad: 14 },
      { id: '8B-22', name: 'JUAN ANDRES SALAZAR GONZALEZ', documento: '1097503979', edad: 14 },
      { id: '8B-23', name: 'DAVID ALEJANDRO SARMIENTO LEON', documento: '1097788874', edad: 13 },
      { id: '8B-24', name: 'MARIA JOSE SERRANO FLOREZ', documento: '1097503609', edad: 14 },
      { id: '8B-25', name: 'RAFAEL SANTIAGO VALERO RIVEROS', documento: '1097505011', edad: 13 },
      { id: '8B-26', name: 'SERGIO AUGUSTO VARGAS ARDILA', documento: '1097787234', edad: 14 },
      { id: '8B-27', name: 'SAMUEL ALEJANDRO VILLAMIZAR MARTINEZ', documento: '1011327088', edad: 14 },
      { id: '8B-28', name: 'VALENTINA VIQUEIRA MEJIA', documento: '750714', edad: 14 }
    ]
  },
  
  // Función para verificar credenciales
  verifyCredentials: (gradeId, studentId, password) => {
    // Buscar el grado
    const grade = studentData.grades.find(g => g.id === gradeId);
    if (!grade) return null;
    
    // Buscar el estudiante en el grado correspondiente
    const student = studentData.students[grade.nombre]?.find(s => s.id === studentId);
    if (!student) return null;
    
    // Verificar la contraseña (número de documento)
    if (student.documento !== password) return null;
    
    // Devolver los datos del estudiante para la sesión
    return {
      id: student.id,
      name: student.name,
      documento: student.documento,
      edad: student.edad,
      grado: grade.nombre,
      grupoId: grade.id,
      role: 'student',
      loginTime: new Date().toISOString()
    };
  },
  
  // Función para obtener compañeros de clase
  getClassmates: (gradeId, currentStudentId) => {
    // Buscar el grado
    const grade = studentData.grades.find(g => g.id === gradeId);
    if (!grade) return [];
    
    // Obtener todos los estudiantes del grado excepto el actual
    return studentData.students[grade.nombre]
      ?.filter(s => s.id !== currentStudentId)
      .map(s => ({
        value: s.id,
        label: s.name
      })) || [];
  }
};

export default studentData;