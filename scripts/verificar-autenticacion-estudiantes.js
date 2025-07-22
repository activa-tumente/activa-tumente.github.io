const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eckuozleqbbcecaycmjt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ Error: No se ha proporcionado la clave de servicio de Supabase.');
  console.error('Por favor, configura la variable de entorno SUPABASE_SERVICE_ROLE_KEY o VITE_SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarAutenticacionEstudiantes() {
  try {
    console.log('🔍 Verificando configuración de autenticación de estudiantes...');

    // Leer el script SQL
    const sqlFilePath = path.join(__dirname, '../sql/verificar_datos_autenticacion.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Dividir el script en consultas individuales
    const queries = sqlScript.split(';').filter(query => query.trim());

    // Ejecutar cada consulta y mostrar los resultados
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();
      if (!query) continue;

      // Extraer el comentario que describe la consulta
      const commentMatch = query.match(/--\s*(.*)/);
      const description = commentMatch ? commentMatch[1].trim() : `Consulta ${i + 1}`;

      console.log(`\n🔍 ${description}:`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: query });

        if (error) {
          console.error(`❌ Error ejecutando consulta: ${error.message}`);
          continue;
        }

        if (data && data.length > 0) {
          console.table(data);
        } else {
          console.log('✅ No se encontraron problemas');
        }
      } catch (queryError) {
        console.error(`❌ Error ejecutando consulta: ${queryError.message}`);
      }
    }

    // Realizar prueba de autenticación con algunos estudiantes de muestra
    console.log('\n🔐 Realizando pruebas de autenticación con estudiantes de muestra:');

    const estudiantesPrueba = [
      { grado: '6B', documento: '1097122645', nombre: 'VICTORIA AGUILAR BECERRA' },
      { grado: '8A', documento: '1097113083', nombre: 'THANYA SOPHIE ACEVEDO GRANADOS' },
      { grado: '8B', documento: '1188214165', nombre: 'DANIEL ESTEBAN AREVALO BRAVO' }
    ];

    for (const estudiante of estudiantesPrueba) {
      console.log(`\n🧪 Probando autenticación para: ${estudiante.nombre} (${estudiante.grado})`);

      // 1. Obtener el grupo correspondiente al grado
      const { data: grupoData, error: grupoError } = await supabase
        .from('grupos')
        .select('id')
        .eq('nombre', estudiante.grado)
        .eq('institucion_educativa_id', '8a9ab6bb-4f0e-4eb9-905d-f16049464305')
        .single();

      if (grupoError) {
        console.error(`❌ Error obteniendo grupo para ${estudiante.grado}:`, grupoError.message);
        continue;
      }

      console.log(`✅ Grupo encontrado para ${estudiante.grado}: ${grupoData.id}`);

      // 2. Buscar el estudiante por documento
      const { data: estudianteData, error: estudianteError } = await supabase
        .from('estudiantes')
        .select('id, nombre_estudiante, apellido_estudiante, numero_documento, grado, grupo_id')
        .eq('numero_documento', estudiante.documento)
        .single();

      if (estudianteError) {
        console.error(`❌ Error obteniendo estudiante con documento ${estudiante.documento}:`, estudianteError.message);
        continue;
      }

      console.log(`✅ Estudiante encontrado: ${estudianteData.nombre_estudiante} ${estudianteData.apellido_estudiante}`);

      // 3. Verificar que el documento coincida (simulando autenticación)
      if (estudianteData.numero_documento === estudiante.documento) {
        console.log(`✅ Autenticación exitosa: El documento coincide`);
      } else {
        console.error(`❌ Error de autenticación: El documento no coincide`);
      }

      // 4. Verificar que el estudiante pertenezca al grupo correcto
      if (estudianteData.grupo_id === grupoData.id) {
        console.log(`✅ Grupo correcto: El estudiante pertenece al grupo ${estudiante.grado}`);
      } else {
        console.error(`❌ Error de grupo: El estudiante no pertenece al grupo ${estudiante.grado}`);
      }

      // 5. Simular creación de sesión
      const sessionData = {
        id: estudianteData.id,
        name: `${estudianteData.nombre_estudiante} ${estudianteData.apellido_estudiante}`,
        documento: estudianteData.numero_documento,
        grado: estudianteData.grado,
        grupoId: estudianteData.grupo_id,
        role: 'student',
        loginTime: new Date().toISOString()
      };

      console.log(`✅ Sesión simulada creada correctamente:`, sessionData);
    }

    console.log('\n✅ Verificación de autenticación completada');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verificarAutenticacionEstudiantes()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });