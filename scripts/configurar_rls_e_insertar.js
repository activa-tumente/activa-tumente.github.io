import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function configurarRLSEInsertar() {
  console.log('🚀 Configurando RLS e insertando datos...');
  
  try {
    // Leer y ejecutar el script de RLS
    console.log('🔧 Configurando políticas RLS...');
    const rlsPath = path.join(__dirname, '..', 'sql', 'disable_rls_estudiantes.sql');
    const rlsContent = fs.readFileSync(rlsPath, 'utf8');
    
    // Dividir el SQL en comandos individuales
    const commands = rlsContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📄 Ejecutando ${commands.length} comandos SQL...`);
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.log(`⚠️ Error ejecutando comando: ${error.message}`);
          } else {
            console.log(`✅ Comando ejecutado exitosamente`);
          }
        } catch (err) {
          console.log(`⚠️ Error general: ${err.message}`);
        }
      }
    }
    
    // Esperar un momento para que los cambios se apliquen
    console.log('⏳ Esperando que se apliquen los cambios...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Ahora insertar los datos
    console.log('\n📊 Insertando datos básicos...');
    
    // Crear algunos grupos básicos
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
    
    console.log('1️⃣ Insertando grupos...');
    
    const gruposInsertados = [];
    
    for (const grupo of gruposBasicos) {
      try {
        const { data, error } = await supabase
          .from('grupos')
          .insert(grupo)
          .select()
          .single();
        
        if (error) {
          console.log(`❌ Error insertando grupo ${grupo.nombre}:`, error.message);
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
            console.log(`❌ Error insertando estudiante ${estudiante.nombre}:`, error.message);
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
      if (gruposVerificacion && gruposVerificacion.length > 0) {
        console.log('📋 Grupos encontrados:', gruposVerificacion.map(g => `${g.nombre} (${g.grado})`).join(', '));
      }
    }
    
    const { data: estudiantesVerificacion, error: errorEstudiantes } = await supabase
      .from('estudiantes')
      .select('*, grupos(nombre)');
    
    if (errorEstudiantes) {
      console.log('❌ Error verificando estudiantes:', errorEstudiantes.message);
    } else {
      console.log(`✅ Estudiantes en BD: ${estudiantesVerificacion?.length || 0}`);
      if (estudiantesVerificacion && estudiantesVerificacion.length > 0) {
        console.log('👥 Estudiantes por grupo:');
        const estudiantesPorGrupo = estudiantesVerificacion.reduce((acc, est) => {
          const grupo = est.grupos?.nombre || 'Sin grupo';
          if (!acc[grupo]) acc[grupo] = [];
          acc[grupo].push(`${est.nombre} ${est.apellido}`);
          return acc;
        }, {});
        
        Object.entries(estudiantesPorGrupo).forEach(([grupo, estudiantes]) => {
          console.log(`   ${grupo}: ${estudiantes.length} estudiantes`);
        });
      }
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
configurarRLSEInsertar();