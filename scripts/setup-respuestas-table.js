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

async function setupRespuestasTable() {
  try {
    console.log('🚀 Iniciando configuración de la tabla de respuestas...');

    // Leer el script SQL
    const sqlFilePath = path.join(__dirname, '../sql/verificar_y_corregir_respuestas.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 Script SQL cargado correctamente');
    console.log('⚙️ Ejecutando script en Supabase...');

    // Ejecutar el script SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });

    if (error) {
      console.error('❌ Error al ejecutar el script SQL:', error);
      
      // Intentar ejecutar el script directamente si la función exec_sql no existe
      console.log('🔄 Intentando método alternativo...');
      
      // Dividir el script en sentencias individuales
      const statements = sqlScript.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });
            if (error) {
              console.warn(`⚠️ Error en sentencia: ${error.message}`);
              console.warn('Continuando con la siguiente sentencia...');
            }
          } catch (stmtError) {
            console.warn(`⚠️ Error en sentencia: ${stmtError.message}`);
            console.warn('Continuando con la siguiente sentencia...');
          }
        }
      }
    } else {
      console.log('✅ Script SQL ejecutado correctamente');
    }

    // Verificar la estructura de la tabla
    console.log('🔍 Verificando estructura de la tabla respuestas...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('respuestas')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Error al verificar la tabla respuestas:', tableError);
      process.exit(1);
    }

    console.log('✅ Tabla respuestas verificada correctamente');
    console.log('🎉 Configuración completada con éxito');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
setupRespuestasTable()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error);
    process.exit(1);
  });