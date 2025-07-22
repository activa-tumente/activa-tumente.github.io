import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  console.log('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertarDatos() {
  console.log('🚀 Insertando datos de estudiantes...');
  
  try {
    // 1. Crear grupos
    console.log('1️⃣ Insertando grupos...');
    const grupos = [
      { id: randomUUID(), nombre: '6B', grado: '6', seccion: 'B', ano_escolar: '2024' },
      { id: randomUUID(), nombre: '8A', grado: '8', seccion: 'A', ano_escolar: '2024' },
      { id: randomUUID(), nombre: '8B', grado: '8', seccion: 'B', ano_escolar: '2024' }
    ];
    
    const gruposCreados = {};
    
    for (const grupo of grupos) {
      // Verificar si el grupo ya existe
      const { data: grupoExistente } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', grupo.nombre)
        .single();
      
      if (grupoExistente) {
        console.log(`✅ Grupo ya existe: ${grupoExistente.nombre}`);
        gruposCreados[grupo.nombre] = grupoExistente.id;
      } else {
        // Crear nuevo grupo
        const { data: nuevoGrupo, error } = await supabase
          .from('grupos')
          .insert(grupo)
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Error creando grupo ${grupo.nombre}:`, error.message);
          continue;
        }
        
        console.log(`✅ Grupo creado: ${nuevoGrupo.nombre}`);
        gruposCreados[grupo.nombre] = nuevoGrupo.id;
      }
    }
    
    // 2. Crear estudiantes
    console.log('2️⃣ Insertando estudiantes...');
    
    // Estudiantes para 6B
    const estudiantes6B = [
      { nombre: 'Ana', apellido: 'García', edad: 12, genero: 'F', numero_documento: '60001' },
      { nombre: 'Carlos', apellido: 'López', edad: 12, genero: 'M', numero_documento: '60002' },
      { nombre: 'María', apellido: 'Rodríguez', edad: 11, genero: 'F', numero_documento: '60003' },
      { nombre: 'José', apellido: 'Martínez', edad: 12, genero: 'M', numero_documento: '60004' },
      { nombre: 'Laura', apellido: 'Hernández', edad: 11, genero: 'F', numero_documento: '60005' }
    ];
    
    // Estudiantes para 8A
    const estudiantes8A = [
      { nombre: 'Pedro', apellido: 'González', edad: 14, genero: 'M', numero_documento: '80001' },
      { nombre: 'Sofia', apellido: 'Díaz', edad: 13, genero: 'F', numero_documento: '80002' },
      { nombre: 'Diego', apellido: 'Torres', edad: 14, genero: 'M', numero_documento: '80003' },
      { nombre: 'Valentina', apellido: 'Ruiz', edad: 13, genero: 'F', numero_documento: '80004' },
      { nombre: 'Andrés', apellido: 'Morales', edad: 14, genero: 'M', numero_documento: '80005' }
    ];
    
    // Estudiantes para 8B
    const estudiantes8B = [
      { nombre: 'Isabella', apellido: 'Castro', edad: 14, genero: 'F', numero_documento: '80101' },
      { nombre: 'Santiago', apellido: 'Vargas', edad: 14, genero: 'M', numero_documento: '80102' },
      { nombre: 'Camila', apellido: 'Jiménez', edad: 13, genero: 'F', numero_documento: '80103' },
      { nombre: 'Mateo', apellido: 'Ramírez', edad: 14, genero: 'M', numero_documento: '80104' },
      { nombre: 'Lucía', apellido: 'Flores', edad: 13, genero: 'F', numero_documento: '80105' }
    ];
    
    let totalEstudiantes = 0;
    
    // Insertar estudiantes de 6B
    if (gruposCreados['6B']) {
      for (const estudiante of estudiantes6B) {
        const { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { data, error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              ...estudiante,
              grupo_id: gruposCreados['6B']
            })
            .select()
            .single();
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error.message);
          } else {
            console.log(`✅ Estudiante creado: ${data.nombre} ${data.apellido} (6B)`);
            totalEstudiantes++;
          }
        }
      }
    }
    
    // Insertar estudiantes de 8A
    if (gruposCreados['8A']) {
      for (const estudiante of estudiantes8A) {
        const { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { data, error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              ...estudiante,
              grupo_id: gruposCreados['8A']
            })
            .select()
            .single();
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error.message);
          } else {
            console.log(`✅ Estudiante creado: ${data.nombre} ${data.apellido} (8A)`);
            totalEstudiantes++;
          }
        }
      }
    }
    
    // Insertar estudiantes de 8B
    if (gruposCreados['8B']) {
      for (const estudiante of estudiantes8B) {
        const { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { data, error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              ...estudiante,
              grupo_id: gruposCreados['8B']
            })
            .select()
            .single();
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error.message);
          } else {
            console.log(`✅ Estudiante creado: ${data.nombre} ${data.apellido} (8B)`);
            totalEstudiantes++;
          }
        }
      }
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Total de estudiantes procesados: ${totalEstudiantes}`);
    console.log(`📚 Grupos disponibles: ${Object.keys(gruposCreados).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la función
insertarDatos();