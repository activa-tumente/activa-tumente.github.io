import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificarEsquemaTablas() {
  console.log('🔍 Verificando esquema de tablas existentes...');
  console.log('');

  try {
    // Verificar esquema de tabla grupos
    console.log('1️⃣ Esquema de tabla grupos:');
    const { data: gruposSchema, error: gruposError } = await supabase
      .from('grupos')
      .select('*')
      .limit(1);
    
    if (gruposError) {
      console.log('❌ Error:', gruposError.message);
    } else {
      console.log('✅ Tabla grupos accesible');
      if (gruposSchema && gruposSchema.length > 0) {
        console.log('   Columnas detectadas:', Object.keys(gruposSchema[0]));
      } else {
        console.log('   Tabla vacía, intentando insertar registro de prueba...');
        const { data: testInsert, error: testError } = await supabase
          .from('grupos')
          .insert({ nombre: 'TEST' })
          .select();
        
        if (testError) {
          console.log('   Error en inserción de prueba:', testError.message);
          console.log('   Detalles:', testError.details);
        } else {
          console.log('   Inserción exitosa, columnas:', Object.keys(testInsert[0]));
          // Eliminar registro de prueba
          await supabase.from('grupos').delete().eq('nombre', 'TEST');
        }
      }
    }

    console.log('');

    // Verificar esquema de tabla estudiantes
    console.log('2️⃣ Esquema de tabla estudiantes:');
    const { data: estudiantesSchema, error: estudiantesError } = await supabase
      .from('estudiantes')
      .select('*')
      .limit(1);
    
    if (estudiantesError) {
      console.log('❌ Error:', estudiantesError.message);
    } else {
      console.log('✅ Tabla estudiantes accesible');
      if (estudiantesSchema && estudiantesSchema.length > 0) {
        console.log('   Columnas detectadas:', Object.keys(estudiantesSchema[0]));
      } else {
        console.log('   Tabla vacía, intentando insertar registro de prueba...');
        const { data: testInsert, error: testError } = await supabase
          .from('estudiantes')
          .insert({ nombre: 'TEST' })
          .select();
        
        if (testError) {
          console.log('   Error en inserción de prueba:', testError.message);
          console.log('   Detalles:', testError.details);
        } else {
          console.log('   Inserción exitosa, columnas:', Object.keys(testInsert[0]));
          // Eliminar registro de prueba
          await supabase.from('estudiantes').delete().eq('nombre', 'TEST');
        }
      }
    }

    console.log('');

    // Verificar si existe tabla instituciones
    console.log('3️⃣ Verificando tabla instituciones:');
    const { data: institucionesData, error: institucionesError } = await supabase
      .from('instituciones')
      .select('*')
      .limit(1);
    
    if (institucionesError) {
      console.log('❌ Tabla instituciones no existe:', institucionesError.message);
      console.log('   Código de error:', institucionesError.code);
    } else {
      console.log('✅ Tabla instituciones existe');
      if (institucionesData && institucionesData.length > 0) {
        console.log('   Columnas detectadas:', Object.keys(institucionesData[0]));
      }
    }

    console.log('');
    console.log('📋 Verificación de esquema completada');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

verificarEsquemaTablas();