# Este archiv  se encarga de la conexion a MySQL, Creacion de la API,
# guardar tareas, leer tareas, actualizar el estado (TODO, IN_PROGRESS y DONE),
# eliminar tareas, asignar usuarios y obtener usuarios

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# Conexion a MySQL
def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Estebangallego17",
        database="tareas_db"
    )


# Rutas API ---------------------------------

# Ruta principal
@app.route("/")
def inicio():
    return redirect("http://localhost:3000")


# Obtiene las tareas con el nombre del usuario asignado
@app.route("/tareas", methods=["GET"])
def obtener_tareas():

    conexion = conectar_bd()
    cursor = conexion.cursor()

  
    cursor.execute("""
        SELECT
            t.id,
            t.titulo,
            t.descripcion,
            t.estado,
            t.id_usuario,
            u.nombre
        FROM tareas t
        LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
    """)

    datos = cursor.fetchall()
    conexion.close()

    tareas = []
    for t in datos:
        tareas.append({
            "id":             t[0],
            "titulo":         t[1],
            "descripcion":    t[2],
            "estado":         t[3],
            "id_usuario":     t[4],        
            "nombre_usuario": t[5]         
        })

    return jsonify(tareas)


# Creación de tareas
@app.route("/tareas", methods=["POST"])
def crear_tarea():

    conexion = conectar_bd()
    cursor = conexion.cursor()

    datos = request.json
    titulo      = datos.get("titulo", "").strip()
    descripcion = datos.get("descripcion", "").strip()
    id_usuario  = datos.get("id_usuario")

    # Validación
    if not titulo:
        conexion.close()
        return jsonify({"error": "El título es obligatorio"}), 400
    if len(titulo) > 100:
        conexion.close()
        return jsonify({"error": "El título supera 100 caracteres"}), 400

    cursor.execute(
        "INSERT INTO tareas (titulo, descripcion, estado, id_usuario) VALUES (%s, %s, %s, %s)",
        (titulo, descripcion, "TODO", id_usuario)
    )

    conexion.commit()
    id_generado = cursor.lastrowid
    conexion.close()

    return jsonify({
        "id":          id_generado,
        "titulo":      titulo,
        "descripcion": descripcion,
        "estado":      "TODO",
        "id_usuario":  id_usuario
    }), 201


# Elimina una tarea
@app.route("/tareas/<int:id>", methods=["DELETE"])
def eliminar_tarea(id):

    conexion = conectar_bd()
    cursor = conexion.cursor()

    cursor.execute("DELETE FROM tareas WHERE id = %s", (id,))

    conexion.commit()
    conexion.close()

    return jsonify({"mensaje": "ok"})


# Avanza el estado
@app.route("/tareas/<int:id>/estado", methods=["PUT"])
def cambiar_estado(id):

    conexion = conectar_bd()
    cursor = conexion.cursor()

    cursor.execute("SELECT estado FROM tareas WHERE id = %s", (id,))
    resultado = cursor.fetchone()

    if resultado is None:
        conexion.close()
        return jsonify({"error": "No existe"}), 404

    estado_actual = resultado[0]

    flujo = {"TODO": "IN_PROGRESS", "IN_PROGRESS": "DONE"}

    if estado_actual not in flujo:
        conexion.close()
        return jsonify({"mensaje": "La tarea ya está finalizada"})

    nuevo_estado = flujo[estado_actual]

    cursor.execute(
        "UPDATE tareas SET estado = %s WHERE id = %s",
        (nuevo_estado, id)
    )

    conexion.commit()
    conexion.close()

    return jsonify({"estado": nuevo_estado})


# Edita el título de una tarea
@app.route("/tareas/<int:id>", methods=["PUT"])
def editar_tarea(id):

    conexion = conectar_bd()
    cursor = conexion.cursor()

    titulo = request.json.get("titulo", "").strip()

    if not titulo:
        conexion.close()
        return jsonify({"error": "El título es obligatorio"}), 400

    cursor.execute(
        "UPDATE tareas SET titulo = %s WHERE id = %s",
        (titulo, id)
    )

    conexion.commit()
    conexion.close()   

    return jsonify({"mensaje": "ok"})


# Asigna o desasigna un usuario a una tarea
@app.route("/tareas/<int:id>/asignar", methods=["PUT"])
def asignar_usuario(id):

    conexion = conectar_bd()
    cursor = conexion.cursor()

    id_usuario = request.json.get("id_usuario")  

    # Verifica tarwa
    cursor.execute("SELECT id FROM tareas WHERE id = %s", (id,))
    if cursor.fetchone() is None:
        conexion.close()
        return jsonify({"error": "Tarea no encontrada"}), 404

    # Verificar usuario
    if id_usuario is not None:
        cursor.execute(
            "SELECT id_usuario FROM usuarios WHERE id_usuario = %s",
            (id_usuario,)
        )
        if cursor.fetchone() is None:
            conexion.close()
            return jsonify({"error": "Usuario no encontrado"}), 404

    cursor.execute(
        "UPDATE tareas SET id_usuario = %s WHERE id = %s",
        (id_usuario, id)
    )

    conexion.commit()
    conexion.close()

    return jsonify({"mensaje": "ok", "id_usuario": id_usuario})


# Obtiene todos los usuarios
@app.route("/usuarios", methods=["GET", "POST"])
def usuarios():

    if request.method == "GET":
        conexion = conectar_bd()
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, nombre, correo FROM usuarios")
        usuarios = cursor.fetchall()
        conexion.close()
        return jsonify(usuarios)

    if request.method == "POST":
        conexion = conectar_bd()
        cursor = conexion.cursor()
        datos  = request.json
        nombre = datos.get("nombre", "").strip()
        correo = datos.get("correo")

        if not nombre:
            conexion.close()
            return jsonify({"error": "El nombre es obligatorio"}), 400

        cursor.execute(
            "INSERT INTO usuarios (nombre, correo) VALUES (%s, %s)",
            (nombre, correo)
        )
        conexion.commit()
        id_generado = cursor.lastrowid
        conexion.close()

        return jsonify({
            "id_usuario": id_generado,
            "nombre": nombre,
            "correo": correo
        }), 201

@app.route("/usuarios/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id_usuario = %s", (id,))
    conexion.commit()
    conexion.close()
    return jsonify({"mensaje": "ok"})

if __name__ == "__main__":
    app.run(debug=True)