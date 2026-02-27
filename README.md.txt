ASIGTAREAS — Gestión de Tareas

Aplicación para gestionar tareas con estados (TODO  IN_PROGRESS  DONE), asignacion de usuarios y tablero kan ban.

Tecnologias

Frontend: React, Material UI (MUI)
Backend: Python, Flask
Base de datos: MySQL


Requisitos previos

Node.js 18+
Python 3.10+
MySQL Workbench 8.0 corriendo localmente


Instalación y ejecución

---Traer el proyecto de github------

1. Base de datos

Abre MySQL worbench y ejecuta:


CREATE DATABASE tareas_db;

USE tareas_db;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150)
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'TODO',
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);


2. Backend (Flask)



en la terminal:

cd Prueba-stefanini---Esteban-Gallego
cd backend-python
pip install flask flask-cors mysql-connector-python
python app.py

El servidor queda corriendo en http://localhost:5000

3. Frontend (React)
bashcd tareas-react
npm install
npm start
La app queda disponible en http://localhost:3000

Estructura 

Proyecto-tareas/
├── backend-python/
│   └── app.py               # API con Flask
└── tareas-react/
    └── src/
        ├── componentes/     # Componentes UI reutilizables
        ├── pantallas/       # Pantalla principal (PantallaTareas.js)
        ├── servicios/       # Capa de acceso a los satos (tareasServicio.js)
        └── App.js

Funcionalidades

Crear tareas con título, descripción y usuario asignado
Cambiar estado respetando el flujo: TODO → IN_PROGRESS → DONE
Asignar o desasignar usuarios a tareas existentes
Filtrar tareas por estado y por usuario
Buscar tareas por título o descripción
Vista Kanban (3 columnas) y vista lista
Crear y eliminar usuarios desde un panel lateral
Manejo de estados: loading, error y empty state


Decisiones técnicas que tome

MUI (Material UI): se eligió porque tiene componentes listos con modo oscuro que era el que queria, animaciones y diseño consistente sin una configuración adicional.
Capa de servicios: todo el acceso al backend está centralizado como lo requirieron en tareasServicio.js.
Separación de responsabilidades: los componentes solo renderizan UI, la lógica esta en PantallTareas.js y el acceso a los datos en servicios/.


Tests

No se implementaron tests

Notas

Asegurarse de que tanto el backend (localhost:5000) como el frontend (localhost:3000) esten corriendo al mismo tiempo
Las credenciales de MySQL están en backend-python/app.py — cámbiarlas si la configuración es diferente en el equipo

GRACIAS