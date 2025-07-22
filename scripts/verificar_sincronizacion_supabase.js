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

async function verificarSincronizacion() {
  console.log('🔍 Verificando sincronización con Supabase...');
  console.log('📍 URL:', supabaseUrl);
  console.log('');

  try {
    // 1. Verificar conexión básica
    console.log('1️⃣ Verificando conexión básica...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️  Error de autenticación:', authError.message);
    } else {
      console.log('✅ Conexión básica exitosa');
    }

    // 2. Verificar tabla instituciones
    console.log('\n2️⃣ Verificando tabla instituciones...');
    const { data: instituciones, error: errorInst } = await supabase
      .from('instituciones')
      .select('*')
      .limit(5);
    
    if (errorInst) {
      console.log('❌ Error en tabla instituciones:', errorInst.message);
      console.log('   Código:', errorInst.code);
    } else {
      console.log('✅ Tabla instituciones encontrada');
      console.log('   Registros encontrados:', instituciones?.length || 0);
      if (instituciones && instituciones.length > 0) {
        console.log('   Ejemplo:', instituciones[0]);
      }
    }

    // 3. Verificar tabla grupos
    console.log('\n3️⃣ Verificando tabla grupos...');
    const { data: grupos, error: errorGrupos } = await supabase
      .from('grupos')
      .select('*')
      .limit(5);
    
    if (errorGrupos) {
      console.log('❌ Error en tabla grupos:', errorGrupos.message);
      console.log('   Código:', errorGrupos.code);
    } else {
      console.log('✅ Tabla grupos encontrada');
      console.log('   Registros encontrados:', grupos?.length || 0);
      if (grupos && grupos.length > 0) {
        console.log('   Ejemplo:', grupos[0]);
      }
    }

    // 4. Verificar tabla estudiantes
    console.log('\n4️⃣ Verificando tabla estudiantes...');
    const { data: estudiantes, error: errorEst } = await supabase
      .from('estudiantes')
      .select('*')
      .limit(5);
    
    if (errorEst) {
      console.log('❌ Error en tabla estudiantes:', errorEst.message);
      console.log('   Código:', errorEst.code);
    } else {
      console.log('✅ Tabla estudiantes encontrada');
      console.log('   Registros encontrados:', estudiantes?.length || 0);
      if (estudiantes && estudiantes.length > 0) {
        console.log('   Ejemplo:', estudiantes[0]);
      }
    }

    // 5. Verificar conteos por grupo
    if (!errorGrupos && !errorEst && grupos && estudiantes) {
      console.log('\n5️⃣ Verificando conteos por grupo...');
      for (const grupo of grupos) {
        const { count } = await supabase
          .from('estudiantes')
          .select('*', { count: 'exact', head: true })
          .eq('grupo_id', grupo.id);
        
        console.log(`   Grupo ${grupo.nombre}: ${count || 0} estudiantes`);
      }
    }

    // 6. Verificar tabla respuestas_cuestionario
    console.log('\n6️⃣ Verificando tabla respuestas_cuestionario...');
    const { data: respuestas, error: errorResp } = await supabase
      .from('respuestas_cuestionario')
      .select('*')
      .limit(5);
    
    if (errorResp) {
      console.log('❌ Error en tabla respuestas_cuestionario:', errorResp.message);
      console.log('   Código:', errorResp.code);
    } else {
      console.log('✅ Tabla respuestas_cuestionario encontrada');
      console.log('   Registros encontrados:', respuestas?.length || 0);
      if (respuestas && respuestas.length > 0) {
        console.log('   Ejemplo:', respuestas[0]);
      }
    }

    // 7. Resumen final
    console.log('\n📊 RESUMEN DE SINCRONIZACIÓN:');
    const tablas = [
      { nombre: 'instituciones', error: errorInst, datos: instituciones?.length || 0 },
      { nombre: 'grupos', error: errorGrupos, datos: grupos?.length || 0 },
      { nombre: 'estudiantes', error: errorEst, datos: estudiantes?.length || 0 },
      { nombre: 'respuestas_cuestionario', error: errorResp, datos: respuestas?.length || 0 }
    ];

    let tablasExistentes = 0;
    let totalRegistros = 0;

    tablas.forEach(tabla => {
      if (!tabla.error) {
        tablasExistentes++;
        totalRegistros += tabla.datos;
        console.log(`✅ ${tabla.nombre}: ${tabla.datos} registros`);
      } else {
        console.log(`❌ ${tabla.nombre}: No disponible`);
      }
    });

    console.log(`\n📈 Estado general:`);
    console.log(`   Tablas existentes: ${tablasExistentes}/4`);
    console.log(`   Total de registros: ${totalRegistros}`);
    
    if (tablasExistentes === 4 && totalRegistros > 0) {
      console.log('🎉 ¡Sincronización exitosa! Usando datos reales de Supabase.');
    } else if (tablasExistentes > 0) {
      console.log('⚠️  Sincronización parcial. Algunas tablas faltan o están vacías.');
    } else {
      console.log('❌ Sin sincronización. Usando datos de ejemplo.');
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

verificarSincronizacion();