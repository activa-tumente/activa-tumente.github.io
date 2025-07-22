import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function consultarEstructura() {
  console.log('🔍 Consultando estructura de tablas...');
  
  try {
    // Consultar información de columnas usando información del sistema
    console.log('\n1️⃣ Consultando estructura de tabla grupos:');
    const { data: gruposInfo, error: gruposError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'grupos' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (gruposError) {
      console.log('❌ Error consultando grupos:', gruposError.message);
      // Intentar consulta directa
      const { data: gruposData, error: gruposError2 } = await supabase
        .from('grupos')
        .select('*')
        .limit(0);
      
      if (gruposError2) {
        console.log('❌ Error en consulta directa grupos:', gruposError2.message);
      } else {
        console.log('✅ Tabla grupos existe pero está vacía');
      }
    } else {
      console.log('✅ Estructura de grupos:', gruposInfo);
    }
    
    console.log('\n2️⃣ Consultando estructura de tabla estudiantes:');
    const { data: estudiantesInfo, error: estudiantesError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'estudiantes' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (estudiantesError) {
      console.log('❌ Error consultando estudiantes:', estudiantesError.message);
      // Intentar consulta directa
      const { data: estudiantesData, error: estudiantesError2 } = await supabase
        .from('estudiantes')
        .select('*')
        .limit(0);
      
      if (estudiantesError2) {
        console.log('❌ Error en consulta directa estudiantes:', estudiantesError2.message);
      } else {
        console.log('✅ Tabla estudiantes existe pero está vacía');
      }
    } else {
      console.log('✅ Estructura de estudiantes:', estudiantesInfo);
    }
    
    // Intentar insertar datos simples
    console.log('\n3️⃣ Intentando insertar datos de prueba...');
    
    // Insertar grupo simple
    const { data: grupoTest, error: grupoTestError } = await supabase
      .from('grupos')
      .insert({
        nombre: 'Test Grupo',
        grado: '6'
      })
      .select();
    
    if (grupoTestError) {
      console.log('❌ Error insertando grupo test:', grupoTestError.message);
    } else {
      console.log('✅ Grupo test insertado:', grupoTest);
      
      // Si el grupo se insertó, intentar insertar estudiante
      const { data: estudianteTest, error: estudianteTestError } = await supabase
        .from('estudiantes')
        .insert({
          nombre: 'Test',
          apellido: 'Estudiante',
          edad: 12,
          numero_documento: 'TEST001',
          grupo_id: grupoTest[0].id
        })
        .select();
      
      if (estudianteTestError) {
        console.log('❌ Error insertando estudiante test:', estudianteTestError.message);
      } else {
        console.log('✅ Estudiante test insertado:', estudianteTest);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la función
consultarEstructura();