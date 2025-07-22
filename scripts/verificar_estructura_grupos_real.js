import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarEstructuraGrupos() {
  try {
    console.log('🔄 Verificando estructura de la tabla grupos...');
    
    // Intentar insertar un grupo de prueba para ver qué columnas acepta
    const gruposPrueba = [
      { nombre: 'TEST' },
      { nombre: 'TEST', grado: '6' },
      { nombre: 'TEST', grado: '6', seccion: 'A' },
      { nombre: 'TEST', descripcion: 'Grupo de prueba' }
    ];
    
    for (let i = 0; i < gruposPrueba.length; i++) {
      const grupo = gruposPrueba[i];
      console.log(`\n🧪 Probando estructura ${i + 1}:`, grupo);
      
      const { data, error } = await supabase
        .from('grupos')
        .insert([grupo])
        .select();
      
      if (error) {
        console.log(`❌ Error con estructura ${i + 1}:`, error.message);
      } else {
        console.log(`✅ Estructura ${i + 1} funciona:`, data);
        
        // Eliminar el grupo de prueba
        await supabase
          .from('grupos')
          .delete()
          .eq('id', data[0].id);
        
        break; // Si funciona, no necesitamos probar más
      }
    }
    
    // Intentar obtener información de la tabla
    console.log('\n🔍 Intentando obtener información de la tabla...');
    
    // Probar con una consulta simple
    const { data: grupos, error: selectError } = await supabase
      .from('grupos')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Error en select:', selectError);
    } else {
      console.log('✅ Consulta exitosa. Estructura aparente:', grupos);
    }
    
    // Intentar crear un grupo mínimo
    console.log('\n📝 Intentando crear grupo mínimo...');
    const { data: grupoMinimo, error: minimoError } = await supabase
      .from('grupos')
      .insert([{ nombre: '6B' }])
      .select();
    
    if (minimoError) {
      console.error('❌ Error creando grupo mínimo:', minimoError);
    } else {
      console.log('✅ Grupo mínimo creado:', grupoMinimo);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
verificarEstructuraGrupos();