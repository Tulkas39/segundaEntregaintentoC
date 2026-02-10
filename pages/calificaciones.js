const profesores = [
  {
    id: 1,
    nombre: "Emiliano Miranda",
    materia: "Ciencias Sociales",
    alumnos: [
      {
        id: 101,
        nombre: "Victoria Stalloca",
        calificaciones: [8.5, 9.0, 7.5, 8.0]
      },
      {
        id: 102,
        nombre: "Altair Grifith",
        calificaciones: [9.5, 9.0, 10, 9.5]
      },
      {
        id: 103,
        nombre: "Juan Carlos",
        calificaciones: [7.0, 6.5, 8.0, 7.5]
      }
    ]
  },
  {
    id: 2,
    nombre: "Victor Díaz",
    materia: "Programación",
    alumnos: [
      {
        id: 101,
        nombre: "Ruben Ortega",
        calificaciones: [8.0, 8.5, 9.0]
      },
      {
        id: 104,
        nombre: "Vanina Díaz",
        calificaciones: [9.0, 8.5, 9.5]
      }
    ]
  }
];


//guardar 
function guardardocenteLS() {
    localStorage.setItem("profesores", JSON.stringify(profesores));
    
}

//cargar 
function cargarDatosLS() {
    const profesoresGuardados = localStorage.getItem("profesores");
    if (profesoresGuardados) {
        const datosCargados = JSON.parse(profesoresGuardados);
        profesores.length = 0; 
        profesores.push(...datosCargados); 
        cargarDocentes(); 
    }
}

//funcion agregar profesores
const formProfesores = document.getElementById ('formProfesores');
const inputProfesores = document.getElementById ('nombreDocente')
const inputMateria = document.getElementById ('materia')
const buttonAgregarProfesor = document.getElementById ('registrarProfesor')

function agregarProfesor(event) {
    event.preventDefault();
    const nombreDocente = inputProfesores.value;
    const materiaDocente = inputMateria.value;
        if (nombreDocente !== '' && materiaDocente !== '') {
            const nuevoProfesor = {
                id: profesores.length > 0 ? Math.max(...profesores.map(p => p.id)) + 1 : 1,
                nombre: nombreDocente,
                materia: materiaDocente, 
                alumnos: []
        };
            profesores.push(nuevoProfesor);
            console.log(profesores);
            inputProfesores.value = '';
            inputMateria.value = '';
            guardardocenteLS();
            cargarDocentes();
}
            else {
                alert('Por favor completa nombre y materia');
}
}
buttonAgregarProfesor.addEventListener('click', agregarProfesor);

//agregar docentes al menú selector
function cargarDocentes() {
    const selectordocentes = document.getElementById ('selectordocentes')
    selectordocentes.innerHTML = '';
    profesores.forEach((profesor) => {
        const option = document.createElement('option');
        option.value = profesor.id;
        option.textContent = `${profesor.nombre} - ${profesor.materia}`;
        selectordocentes.appendChild(option);
    });
}

//seleccionar docente
document.getElementById('selectordocentes').addEventListener('change', function() {
    const profesorId = parseInt(this.value);
    if (profesorId) {
        const profesor = profesores.find(p => p.id === profesorId);
        if (profesor) {
            console.log (`Alumnos de ${profesor.nombre}:`, profesor.alumnos);
            mostrarAlumnos(profesorId);
        }
    }
});        
  
function mostrarAlumnos(profesorId) {
    const profesor = profesores.find (p => p.id === profesorId);
    if (profesor) {
        console.log(`Mostrando alumnos de ${profesor.nombre}:`, profesor.alumnos);
    }
    
}

const inputAlumnos = document.getElementById("alumnos")
const inputCalificacionFinal = document.getElementById("calificacionFinal");
const buttonEnviarCalificacion = document.getElementById("enviarCalificacion")

//agregaralumno
function agregarAlumno(event){
    event.preventDefault();
    const selectordocentes = document.getElementById ('selectordocentes');
    const profesorId = parseInt(selectordocentes.value);
    const nombreAlumno = inputAlumnos.value.trim();
    const calificacion = parseFloat (inputCalificacionFinal.value);
    
    const profesor = profesores.find(p => p.id === profesorId);
    if (!profesorId){
        alert('Por favor selecciona un docente primero');
        return;
    }
    if (nombreAlumno === '') {
        alert('Por favor ingresa el nombre del alumno');
        return;
    }
    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
        alert('Por favor ingresa una calificación válida entre 1 y 10');
        return;
    }
    const alumnoCargado = profesor.alumnos.find (a => a.nombre === nombreAlumno);
    if (alumnoCargado) {
        alumnoCargado.calificaciones.push(calificacion);
        obtenerPromedio(alumnoCargado)   
    }
    else {
       const nuevoAlumno = {
        id: profesor.alumnos.length > 0 ? Math.max(...profesor.alumnos.map(a => a.id)) + 1 : 1,
        nombre: nombreAlumno,
        calificaciones: [calificacion]
       }
        profesor.alumnos.push(nuevoAlumno);
        console.log(`Alumno ${nombreAlumno} agregado a ${profesor.nombre}con calificación ${calificacion}`);
        inputAlumnos.value = '';
        inputCalificacionFinal.value = '';
        obtenerPromedio(nuevoAlumno)
        guardardocenteLS()
        mostrarAlumnos(profesorId);
   };

}

//funcion aprobar/desaprobar alumno

function obtenerPromedio (nuevoAlumno) {
    const mensajeCalificacionFinal = document.getElementById('mensajeCalificacionFinal');

    if (!mensajeCalificacionFinal) return;

    const promedioAlumno = nuevoAlumno.calificaciones.reduce ((sum, nota) => sum + nota, 0) / nuevoAlumno.calificaciones.length;
    const promedioRedondeado = promedioAlumno.toFixed(2);
    if (promedioAlumno >= 7) {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está aprobada con una calificación promedio de " + promedioAlumno);
   
    
} else {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está DESAPROBADO con una calificación promedio de " + promedioAlumno);
    
}
};
buttonEnviarCalificacion.addEventListener ('click', agregarAlumno)
cargarDatosLS(); 
cargarDocentes();


// Estaba tratando de obtener un promedio de las calificaciones de todas las materias de un alumno

/*function obtenerCalificacionesAlumno(nombreAlumno) {
    const calificacionesPorMateria = [];
    profesores.forEach (profesor => {
        const alumno = profesor.alumnos.find (a => a.nombre === nombreAlumno);
        if (alumno) {
            calificacionesPorMateria.push ({
                materia: profesor.materia,
                profesor: profesor.nombre,
                calificaciones: alumno.calificaciones})
    }})
    return calificacionesPorMateria;
}

const calificacionesVictoria = obtenerCalificacionesAlumno ("Victoria Stalloca");
console.log (calificacionesVictoria);
*/    

