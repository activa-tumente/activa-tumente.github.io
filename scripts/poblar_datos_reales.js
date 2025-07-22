import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function poblarDatosReales() {
  console.log('🚀 Poblando base de datos con datos reales...');
  console.log('');

  try {
    // 1. Insertar grupos reales con UUIDs
    console.log('1️⃣ Insertando grupos reales...');
    const grupos = [
      {
        id: randomUUID(),
        nombre: '6B',
        institucion_id: randomUUID()
      },
      {
        id: randomUUID(),
        nombre: '8A',
        institucion_id: randomUUID()
      },
      {
        id: randomUUID(),
        nombre: '8B',
        institucion_id: randomUUID()
      }
    ];

    const { data: gruposData, error: gruposError } = await supabase
      .from('grupos')
      .insert(grupos)
      .select();

    if (gruposError) {
      console.log('❌ Error insertando grupos:', gruposError.message);
      console.log('   Detalles:', gruposError.details);
      return;
    } else {
      console.log('✅ Grupos insertados correctamente:', gruposData?.length || 0);
    }

    // 2. Generar estudiantes para cada grupo (solo columnas básicas)
    console.log('\n2️⃣ Generando estudiantes...');
    
    const todosEstudiantes = [];
    
    // Estudiantes para cada grupo
    const conteosPorGrupo = [25, 30, 28]; // 6B, 8A, 8B
    
    gruposData.forEach((grupo, index) => {
      const conteo = conteosPorGrupo[index];
      for (let i = 1; i <= conteo; i++) {
        todosEstudiantes.push({
          id: randomUUID(),
          nombre: `Estudiante ${grupo.nombre}-${i}`,
          grupo_id: grupo.id
        });
      }
    });

    // Insertar estudiantes en lotes pequeños
    console.log(`   Insertando ${todosEstudiantes.length} estudiantes en lotes...`);
    
    const loteSize = 10;
    let insertados = 0;
    
    for (let i = 0; i < todosEstudiantes.length; i += loteSize) {
      const lote = todosEstudiantes.slice(i, i + loteSize);
      
      const { data: estudiantesData, error: estudiantesError } = await supabase
        .from('estudiantes')
        .insert(lote)
        .select();

      if (estudiantesError) {
        console.log(`❌ Error en lote ${Math.floor(i/loteSize) + 1}:`, estudiantesError.message);
        console.log('   Detalles:', estudiantesError.details);
        break;
      } else {
        insertados += estudiantesData?.length || 0;
        console.log(`   Lote ${Math.floor(i/loteSize) + 1} completado: ${estudiantesData?.length || 0} estudiantes`);
      }
    }

    console.log(`✅ Total estudiantes insertados: ${insertados}`);

    // 3. Verificar conteos finales
    console.log('\n3️⃣ Verificando conteos finales...');
    for (const grupo of gruposData) {
      const { count } = await supabase
        .from('estudiantes')
        .select('*', { count: 'exact', head: true })
        .eq('grupo_id', grupo.id);
      
      console.log(`   Grupo ${grupo.nombre}: ${count || 0} estudiantes`);
    }

    // 4. Resumen final
    console.log('\n🎉 DATOS POBLADOS EXITOSAMENTE!');
    console.log('📊 Resumen:');
    console.log('   • 3 grupos: 6B, 8A, 8B');
    console.log(`   • ${insertados} estudiantes en total`);
    console.log('');
    console.log('✅ La aplicación ahora usará datos reales de Supabase');
    console.log('');
    console.log('📋 IDs de grupos creados:');
    gruposData.forEach(grupo => {
      console.log(`   ${grupo.nombre}: ${grupo.id}`);
    });

  } catch (error) {
    console.error('💥 Error general:', error.message);
    console.error('Detalles:', error);
  }
}

poblarDatosReales();