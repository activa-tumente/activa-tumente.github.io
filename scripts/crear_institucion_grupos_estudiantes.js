import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Datos reales de estudiantes
const estudiantesReales = {
  '6B': [
    { documento: '1007274827', nombre: 'JUAN DAVID', apellido: 'ACOSTA TORRES', edad: 12 },
    { documento: '1007274828', nombre: 'MARIA ALEJANDRA', apellido: 'AGUDELO RAMIREZ', edad: 11 },
    // ... resto de estudiantes 6B
  ],
  '8A': [
    { documento: '1007274861', nombre: 'ALEJANDRO', apellido: 'ACEVEDO MARTINEZ', edad: 14 },
    // ... resto de estudiantes 8A
  ],
  '8B': [
    { documento: '1007274886', nombre: 'THOMAS JOSE', apellido: 'PEREZ CORREA', edad: 14 },
    // ... resto de estudiantes 8B
  ]
};

async function crearInstitucionGruposEstudiantes() {
  try {
    console.log('🚀 Iniciando proceso completo...');
    
    // Paso 1: Crear institución educativa
    console.log('🏫 Creando institución educativa...');
    
    const { data: institucion, error: errorInstitucion } = await supabase
      .from('instituciones_educativas')
      .insert({
        nombre: 'Institución Educativa BULL-S',
        direccion: 'Dirección de prueba',
        telefono: '123456789',
        email: 'contacto@bulls.edu.co'
      })
      .select()
      .single();
    
    if (errorInstitucion) {
      console.error('❌ Error creando institución:', errorInstitucion);
      return;
    }
    
    console.log(`✅ Institución creada con ID: ${institucion.id}`);
    
    // Paso 2: Crear grupos
    console.log('\n📚 Creando grupos...');
    
    const grupos = [
      { grado: '6B', nombre: 'Sexto B' },
      { grado: '8A', nombre: 'Octavo A' },
      { grado: '8B', nombre: 'Octavo B' }
    ];
    
    const gruposCreados = {};
    
    for (const grupo of grupos) {
      console.log(`📝 Creando grupo ${grupo.grado}...`);
      
      const { data: grupoData, error: grupoError } = await supabase
        .from('grupos')
        .insert({
          nombre: grupo.nombre,
          grado: grupo.grado,
          institucion_id: institucion.id
        })
        .select()
        .single();
      
      if (grupoError) {
        console.error(`❌ Error creando grupo ${grupo.grado}:`, grupoError);
        continue;
      }
      
      gruposCreados[grupo.grado] = grupoData.id;
      console.log(`✅ Grupo ${grupo.grado} creado con ID: ${grupoData.id}`);
    }
    
    // Paso 3: Insertar estudiantes
    console.log('\n👥 Insertando estudiantes...');
    
    let totalInsertados = 0;
    const resumenPorGrado = {};
    
    for (const [grado, estudiantes] of Object.entries(estudiantesReales)) {
      const grupoId = gruposCreados[grado];
      
      if (!grupoId) {
        console.log(`⚠️ Grupo ${grado} no encontrado, saltando estudiantes`);
        continue;
      }
      
      console.log(`\n📖 Insertando estudiantes del grado ${grado}...`);
      resumenPorGrado[grado] = 0;
      
      for (const estudiante of estudiantes) {
        const { data, error } = await supabase
          .from('estudiantes')
          .insert({
            numero_documento: estudiante.documento,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            edad: estudiante.edad,
            grupo_id: grupoId,
            password: estudiante.documento
          });
        
        if (error) {
          console.error(`❌ Error insertando ${estudiante.nombre}:`, error.message);
        } else {
          totalInsertados++;
          resumenPorGrado[grado]++;
          console.log(`✅ ${estudiante.nombre} ${estudiante.apellido} insertado`);
        }
      }
    }
    
    // Paso 4: Verificación final
    console.log('\n🔍 Verificando inserción final...');
    const { data: verificacion } = await supabase
      .from('estudiantes')
      .select('*', { count: 'exact' });
    
    console.log(`✅ Total de estudiantes en la base de datos: ${verificacion.length}`);
    console.log(`✅ Estudiantes insertados en esta ejecución: ${totalInsertados}`);
    console.log('📊 Resumen por grado:');
    for (const [grado, cantidad] of Object.entries(resumenPorGrado)) {
      console.log(`   ${grado}: ${cantidad} estudiantes`);
    }
    
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

crearInstitucionGruposEstudiantes();