import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  console.log('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function crearTablasSiNoExisten() {
  console.log('🔧 Verificando y creando tablas si es necesario...');
  
  try {
    // Crear tabla instituciones si no existe
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.instituciones (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nombre VARCHAR(255) UNIQUE NOT NULL,
          direccion TEXT,
          telefono VARCHAR(50),
          email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS public.grupos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nombre VARCHAR(100) NOT NULL,
          grado VARCHAR(10),
          seccion VARCHAR(10),
          ano_escolar VARCHAR(10),
          institucion_id UUID REFERENCES public.instituciones(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(nombre, institucion_id)
        );
        
        CREATE TABLE IF NOT EXISTS public.estudiantes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nombre VARCHAR(100) NOT NULL,
          apellido VARCHAR(100),
          edad INTEGER,
          genero VARCHAR(1) CHECK (genero IN ('M', 'F')),
          numero_documento VARCHAR(50) UNIQUE,
          grupo_id UUID REFERENCES public.grupos(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Desactivar RLS temporalmente
        ALTER TABLE public.instituciones DISABLE ROW LEVEL SECURITY;
        ALTER TABLE public.grupos DISABLE ROW LEVEL SECURITY;
        ALTER TABLE public.estudiantes DISABLE ROW LEVEL SECURITY;
      `
    });
    
    console.log('✅ Tablas verificadas/creadas exitosamente');
  } catch (error) {
    console.log('⚠️ No se pudo ejecutar SQL directo, continuando con inserción...');
  }
}

async function insertarDatos() {
  console.log('🚀 Insertando datos reales de estudiantes...');
  
  try {
    // Crear tablas si no existen
    await crearTablasSiNoExisten();
    // 1. Crear institución
    console.log('1️⃣ Insertando institución...');
    let institucionId = randomUUID();
    const { data: institucion, error: errorInstitucion } = await supabase
      .from('instituciones')
      .insert({
        id: institucionId,
        nombre: 'Colegio La SALLE',
        direccion: 'Dirección del Colegio La SALLE',
        telefono: '555-0001',
        email: 'info@lasalle.edu'
      })
      .select()
      .single();
    
    if (errorInstitucion) {
      console.log('⚠️ Institución ya existe o error:', errorInstitucion.message || 'Error desconocido');
      // Intentar obtener la institución existente
      const { data: institucionExistente } = await supabase
        .from('instituciones')
        .select('*')
        .limit(1)
        .single();
      
      if (institucionExistente) {
        console.log('✅ Usando institución existente:', institucionExistente.nombre);
        institucionId = institucionExistente.id;
      } else {
        console.error('❌ No se pudo crear ni encontrar institución');
        return;
      }
    } else {
      console.log('✅ Institución creada:', institucion.nombre);
    }
    
    // 2. Crear grupos
    console.log('2️⃣ Verificando grupos...');
    const grupos = [
      { nombre: '6B', grado: '6', seccion: 'B', ano_escolar: '2024' },
      { nombre: '8A', grado: '8', seccion: 'A', ano_escolar: '2024' },
      { nombre: '8B', grado: '8', seccion: 'B', ano_escolar: '2024' }
    ];
    
    const gruposCreados = [];
    
    for (const grupo of grupos) {
      // Verificar si el grupo ya existe
      let { data: grupoExistente } = await supabase
        .from('grupos')
        .select('*')
        .eq('nombre', grupo.nombre)
        .eq('institucion_id', institucionId)
        .single();
      
      if (grupoExistente) {
        console.log('✅ Grupo ya existe:', grupoExistente.nombre);
        gruposCreados.push(grupoExistente);
      } else {
        // Crear nuevo grupo
        const { data: grupoData, error: errorGrupo } = await supabase
          .from('grupos')
          .insert({
            id: randomUUID(),
            nombre: grupo.nombre,
            grado: grupo.grado,
            seccion: grupo.seccion,
            ano_escolar: grupo.ano_escolar,
            institucion_id: institucionId
          })
          .select()
          .single();
        
        if (errorGrupo) {
          console.error(`❌ Error insertando grupo ${grupo.nombre}:`, errorGrupo);
          continue;
        }
        
        gruposCreados.push(grupoData);
        console.log(`✅ Grupo creado: ${grupoData.nombre}`);
      }
    }
    
    // 3. Crear estudiantes
    console.log('3️⃣ Verificando estudiantes...');
    
    // Estudiantes para 6B
    const estudiantes6B = [
      { nombre: 'Ana', apellido: 'García Rodríguez', edad: 11, genero: 'F', numero_documento: '1234567890' },
      { nombre: 'Carlos', apellido: 'López Martínez', edad: 12, genero: 'M', numero_documento: '1234567891' },
      { nombre: 'María', apellido: 'Rodríguez Silva', edad: 11, genero: 'F', numero_documento: '1234567892' },
      { nombre: 'José', apellido: 'Martínez González', edad: 12, genero: 'M', numero_documento: '1234567893' },
      { nombre: 'Laura', apellido: 'González Pérez', edad: 11, genero: 'F', numero_documento: '1234567894' },
      { nombre: 'Diego', apellido: 'Pérez Ramírez', edad: 12, genero: 'M', numero_documento: '1234567895' },
      { nombre: 'Sofía', apellido: 'Ramírez Torres', edad: 11, genero: 'F', numero_documento: '1234567896' },
      { nombre: 'Andrés', apellido: 'Torres Vargas', edad: 12, genero: 'M', numero_documento: '1234567897' },
      { nombre: 'Valentina', apellido: 'Vargas Castro', edad: 11, genero: 'F', numero_documento: '1234567898' },
      { nombre: 'Santiago', apellido: 'Castro Morales', edad: 12, genero: 'M', numero_documento: '1234567899' }
    ];
    
    // Estudiantes para 8A
    const estudiantes8A = [
      { nombre: 'Adriana', apellido: 'Castillo Ramírez', edad: 13, genero: 'F', numero_documento: '1234568001' },
      { nombre: 'Bruno', apellido: 'Herrera Morales', edad: 14, genero: 'M', numero_documento: '1234568002' },
      { nombre: 'Camila', apellido: 'Jiménez Silva', edad: 13, genero: 'F', numero_documento: '1234568003' },
      { nombre: 'Daniel', apellido: 'Morales García', edad: 14, genero: 'M', numero_documento: '1234568004' },
      { nombre: 'Elena', apellido: 'Navarro López', edad: 13, genero: 'F', numero_documento: '1234568005' },
      { nombre: 'Fernando', apellido: 'Ortega Martínez', edad: 14, genero: 'M', numero_documento: '1234568006' },
      { nombre: 'Gabriela', apellido: 'Paredes González', edad: 13, genero: 'F', numero_documento: '1234568007' },
      { nombre: 'Héctor', apellido: 'Quintero Pérez', edad: 14, genero: 'M', numero_documento: '1234568008' },
      { nombre: 'Isabella', apellido: 'Ramos Ramírez', edad: 13, genero: 'F', numero_documento: '1234568009' },
      { nombre: 'Julián', apellido: 'Salazar Torres', edad: 14, genero: 'M', numero_documento: '1234568010' }
    ];
    
    // Estudiantes para 8B
    const estudiantes8B = [
      { nombre: 'Karla', apellido: 'Téllez Vargas', edad: 13, genero: 'F', numero_documento: '1234569001' },
      { nombre: 'Leonardo', apellido: 'Uribe Castro', edad: 14, genero: 'M', numero_documento: '1234569002' },
      { nombre: 'Mariana', apellido: 'Vega Morales', edad: 13, genero: 'F', numero_documento: '1234569003' },
      { nombre: 'Nicolás', apellido: 'Wills Herrera', edad: 14, genero: 'M', numero_documento: '1234569004' },
      { nombre: 'Olivia', apellido: 'Ximénez Jiménez', edad: 13, genero: 'F', numero_documento: '1234569005' },
      { nombre: 'Pablo', apellido: 'Yáñez Morales', edad: 14, genero: 'M', numero_documento: '1234569006' },
      { nombre: 'Quintana', apellido: 'Zapata Navarro', edad: 13, genero: 'F', numero_documento: '1234569007' },
      { nombre: 'Ricardo', apellido: 'Acosta Ortega', edad: 14, genero: 'M', numero_documento: '1234569008' },
      { nombre: 'Samantha', apellido: 'Bermúdez Paredes', edad: 13, genero: 'F', numero_documento: '1234569009' },
      { nombre: 'Tomás', apellido: 'Córdoba Quintero', edad: 14, genero: 'M', numero_documento: '1234569010' }
    ];
    
    // Insertar estudiantes por grupo
    const gruposPorNombre = {};
    gruposCreados.forEach(grupo => {
      gruposPorNombre[grupo.nombre] = grupo.id;
    });
    
    let totalEstudiantes = 0;
    
    // Insertar estudiantes 6B
    if (gruposPorNombre['6B']) {
      for (const estudiante of estudiantes6B) {
        // Verificar si el estudiante ya existe
        let { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              nombre: estudiante.nombre,
              apellido: estudiante.apellido,
              edad: estudiante.edad,
              genero: estudiante.genero,
              numero_documento: estudiante.numero_documento,
              grupo_id: gruposPorNombre['6B']
            });
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error);
          } else {
            console.log(`✅ Estudiante creado: ${estudiante.nombre} ${estudiante.apellido}`);
            totalEstudiantes++;
          }
        }
      }
      console.log(`✅ Estudiantes 6B procesados: ${estudiantes6B.length}`);
    }
    
    // Insertar estudiantes 8A
    if (gruposPorNombre['8A']) {
      for (const estudiante of estudiantes8A) {
        // Verificar si el estudiante ya existe
        let { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              nombre: estudiante.nombre,
              apellido: estudiante.apellido,
              edad: estudiante.edad,
              genero: estudiante.genero,
              numero_documento: estudiante.numero_documento,
              grupo_id: gruposPorNombre['8A']
            });
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error);
          } else {
            console.log(`✅ Estudiante creado: ${estudiante.nombre} ${estudiante.apellido}`);
            totalEstudiantes++;
          }
        }
      }
      console.log(`✅ Estudiantes 8A procesados: ${estudiantes8A.length}`);
    }
    
    // Insertar estudiantes 8B
    if (gruposPorNombre['8B']) {
      for (const estudiante of estudiantes8B) {
        // Verificar si el estudiante ya existe
        let { data: estudianteExistente } = await supabase
          .from('estudiantes')
          .select('*')
          .eq('numero_documento', estudiante.numero_documento)
          .single();
        
        if (estudianteExistente) {
          console.log(`✅ Estudiante ya existe: ${estudianteExistente.nombre} ${estudianteExistente.apellido}`);
          totalEstudiantes++;
        } else {
          const { error } = await supabase
            .from('estudiantes')
            .insert({
              id: randomUUID(),
              nombre: estudiante.nombre,
              apellido: estudiante.apellido,
              edad: estudiante.edad,
              genero: estudiante.genero,
              numero_documento: estudiante.numero_documento,
              grupo_id: gruposPorNombre['8B']
            });
          
          if (error) {
            console.error(`❌ Error insertando estudiante ${estudiante.nombre}:`, error);
          } else {
            console.log(`✅ Estudiante creado: ${estudiante.nombre} ${estudiante.apellido}`);
            totalEstudiantes++;
          }
        }
      }
      console.log(`✅ Estudiantes 8B procesados: ${estudiantes8B.length}`);
    }
    
    console.log('\n🎉 ¡Datos insertados exitosamente!');
    console.log(`📊 Total de estudiantes: ${totalEstudiantes}`);
    console.log(`📚 Total de grupos: ${gruposCreados.length}`);
    console.log('\n🔑 Los estudiantes pueden usar su número de documento como contraseña');
    console.log('\n📋 Grupos creados:');
    gruposCreados.forEach(grupo => {
      console.log(`   ${grupo.nombre}: ${grupo.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
insertarDatos();