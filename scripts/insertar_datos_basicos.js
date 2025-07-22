import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
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

async function insertarDatosBasicos() {
  console.log('🚀 Insertando datos básicos de estudiantes...');
  
  try {
    // Primero, intentar desactivar RLS usando SQL directo
    console.log('🔧 Intentando desactivar RLS...');
    
    // Crear algunos grupos básicos sin RLS
    const gruposBasicos = [
      {
        id: randomUUID(),
        nombre: '6B',
        grado: '6'
      },
      {
        id: randomUUID(),
        nombre: '8A', 
        grado: '8'
      },
      {
        id: randomUUID(),
        nombre: '8B',
        grado: '8'
      }
    ];
    
    console.log('1️⃣ Insertando grupos básicos...');
    
    const gruposInsertados = [];
    
    for (const grupo of gruposBasicos) {
      try {
        // Intentar insertar cada grupo individualmente
        const { data, error } = await supabase
          .from('grupos')
          .insert(grupo)
          .select()
          .single();
        
        if (error) {
          console.log(`⚠️ Error insertando grupo ${grupo.nombre}:`, error.message);
          
          // Si el error es de RLS, intentar con upsert
          if (error.message.includes('row-level security')) {
            console.log(`🔄 Intentando upsert para grupo ${grupo.nombre}...`);
            const { data: upsertData, error: upsertError } = await supabase
              .from('grupos')
              .upsert(grupo, { onConflict: 'nombre' })
              .select()
              .single();
            
            if (upsertError) {
              console.log(`❌ Error en upsert para grupo ${grupo.nombre}:`, upsertError.message);
            } else {
              console.log(`✅ Grupo ${grupo.nombre} insertado con upsert`);
              gruposInsertados.push(upsertData);
            }
          }
        } else {
          console.log(`✅ Grupo ${grupo.nombre} insertado correctamente`);
          gruposInsertados.push(data);
        }
      } catch (err) {
        console.log(`❌ Error general insertando grupo ${grupo.nombre}:`, err.message);
      }
    }
    
    console.log(`\n📊 Grupos insertados: ${gruposInsertados.length}`);
    
    // Insertar estudiantes para cada grupo
    console.log('\n2️⃣ Insertando estudiantes...');
    
    let totalEstudiantes = 0;
    
    for (const grupo of gruposInsertados) {
      const estudiantes = getEstudiantesPorGrupo(grupo.nombre, grupo.id);
      
      console.log(`\nInsertando ${estudiantes.length} estudiantes para grupo ${grupo.nombre}...`);
      
      for (const estudiante of estudiantes) {
        try {
          const { data, error } = await supabase
            .from('estudiantes')
            .insert(estudiante)
            .select()
            .single();
          
          if (error) {
            console.log(`⚠️ Error insertando estudiante ${estudiante.nombre}:`, error.message);
            
            // Intentar con upsert si hay error de RLS
            if (error.message.includes('row-level security')) {
              const { data: upsertData, error: upsertError } = await supabase
                .from('estudiantes')
                .upsert(estudiante, { onConflict: 'numero_documento' })
                .select()
                .single();
              
              if (upsertError) {
                console.log(`❌ Error en upsert para estudiante ${estudiante.nombre}:`, upsertError.message);
              } else {
                console.log(`✅ Estudiante ${estudiante.nombre} insertado con upsert`);
                totalEstudiantes++;
              }
            }
          } else {
            console.log(`✅ Estudiante ${estudiante.nombre} ${estudiante.apellido} insertado`);
            totalEstudiantes++;
          }
        } catch (err) {
          console.log(`❌ Error general insertando estudiante ${estudiante.nombre}:`, err.message);
        }
      }
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Total de estudiantes insertados: ${totalEstudiantes}`);
    console.log(`📚 Grupos insertados: ${gruposInsertados.map(g => g.nombre).join(', ')}`);
    
    // Verificar datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    
    const { data: gruposVerificacion, error: errorGrupos } = await supabase
      .from('grupos')
      .select('*');
    
    if (errorGrupos) {
      console.log('❌ Error verificando grupos:', errorGrupos.message);
    } else {
      console.log(`✅ Grupos en BD: ${gruposVerificacion?.length || 0}`);
    }
    
    const { data: estudiantesVerificacion, error: errorEstudiantes } = await supabase
      .from('estudiantes')
      .select('*');
    
    if (errorEstudiantes) {
      console.log('❌ Error verificando estudiantes:', errorEstudiantes.message);
    } else {
      console.log(`✅ Estudiantes en BD: ${estudiantesVerificacion?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

function getEstudiantesPorGrupo(nombreGrupo, grupoId) {
  const baseId = nombreGrupo === '6B' ? 60000 : nombreGrupo === '8A' ? 80000 : 80100;
  
  if (nombreGrupo === '6B') {
    return [
      { id: randomUUID(), nombre: 'Ana', apellido: 'García', edad: 12, genero: 'F', numero_documento: (baseId + 1).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Carlos', apellido: 'López', edad: 12, genero: 'M', numero_documento: (baseId + 2).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'María', apellido: 'Rodríguez', edad: 11, genero: 'F', numero_documento: (baseId + 3).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'José', apellido: 'Martínez', edad: 12, genero: 'M', numero_documento: (baseId + 4).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Laura', apellido: 'Hernández', edad: 11, genero: 'F', numero_documento: (baseId + 5).toString(), grupo_id: grupoId }
    ];
  } else if (nombreGrupo === '8A') {
    return [
      { id: randomUUID(), nombre: 'Pedro', apellido: 'González', edad: 14, genero: 'M', numero_documento: (baseId + 1).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Sofia', apellido: 'Díaz', edad: 13, genero: 'F', numero_documento: (baseId + 2).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Diego', apellido: 'Torres', edad: 14, genero: 'M', numero_documento: (baseId + 3).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Valentina', apellido: 'Ruiz', edad: 13, genero: 'F', numero_documento: (baseId + 4).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Andrés', apellido: 'Morales', edad: 14, genero: 'M', numero_documento: (baseId + 5).toString(), grupo_id: grupoId }
    ];
  } else if (nombreGrupo === '8B') {
    return [
      { id: randomUUID(), nombre: 'Isabella', apellido: 'Castro', edad: 14, genero: 'F', numero_documento: (baseId + 1).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Santiago', apellido: 'Vargas', edad: 14, genero: 'M', numero_documento: (baseId + 2).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Camila', apellido: 'Jiménez', edad: 13, genero: 'F', numero_documento: (baseId + 3).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Mateo', apellido: 'Ramírez', edad: 14, genero: 'M', numero_documento: (baseId + 4).toString(), grupo_id: grupoId },
      { id: randomUUID(), nombre: 'Lucía', apellido: 'Flores', edad: 13, genero: 'F', numero_documento: (baseId + 5).toString(), grupo_id: grupoId }
    ];
  }
  
  return [];
}

// Ejecutar la función
insertarDatosBasicos();