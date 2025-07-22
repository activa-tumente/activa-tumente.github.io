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

// Grupos que necesitamos
const gruposNecesarios = [
  {
    nombre: '6B',
    grado: '6',
    seccion: 'B',
    ano_escolar: '2024'
  },
  {
    nombre: '8A',
    grado: '8',
    seccion: 'A',
    ano_escolar: '2024'
  },
  {
    nombre: '8B',
    grado: '8',
    seccion: 'B',
    ano_escolar: '2024'
  }
];

async function crearGruposSimples() {
  try {
    console.log('🔄 Verificando estructura de la tabla grupos...');
    
    // 1. Verificar grupos existentes
    const { data: gruposExistentes, error: gruposError } = await supabase
      .from('grupos')
      .select('*');
    
    if (gruposError) {
      console.error('❌ Error obteniendo grupos:', gruposError);
      return;
    }
    
    console.log('📋 Grupos existentes:', gruposExistentes);
    
    // 2. Eliminar grupos existentes para empezar limpio
    if (gruposExistentes && gruposExistentes.length > 0) {
      console.log('🗑️ Eliminando grupos existentes...');
      const { error: deleteError } = await supabase
        .from('grupos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
      
      if (deleteError) {
        console.error('❌ Error eliminando grupos:', deleteError);
        return;
      }
      console.log('✅ Grupos existentes eliminados');
    }
    
    // 3. Crear grupos nuevos
    console.log('📝 Creando grupos necesarios...');
    
    for (const grupo of gruposNecesarios) {
      console.log(`📝 Creando grupo ${grupo.nombre}...`);
      
      const { data: nuevoGrupo, error: createError } = await supabase
        .from('grupos')
        .insert([grupo])
        .select()
        .single();
      
      if (createError) {
        console.error(`❌ Error creando grupo ${grupo.nombre}:`, createError);
      } else {
        console.log(`✅ Grupo creado: ${nuevoGrupo.nombre} (ID: ${nuevoGrupo.id})`);
      }
    }
    
    // 4. Verificar grupos finales
    console.log('🔍 Verificando grupos finales...');
    const { data: gruposFinales, error: finalError } = await supabase
      .from('grupos')
      .select('*');
    
    if (finalError) {
      console.error('❌ Error verificando grupos finales:', finalError);
      return;
    }
    
    console.log('📋 Grupos creados exitosamente:');
    gruposFinales.forEach(grupo => {
      console.log(`   - ${grupo.nombre} (ID: ${grupo.id})`);
    });
    
    console.log('🎉 ¡Creación de grupos completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
crearGruposSimples();