const BASE = "http://localhost:5000";

// tareas
export async function obtenerTareas() {
  const res = await fetch(`${BASE}/tareas`);
  return res.json();
}

export async function crearTarea(tarea) {
  const res = await fetch(`${BASE}/tareas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarea),
  });
  return res.json();
}

export async function cambiarEstado(id) {
  const res = await fetch(`${BASE}/tareas/${id}/estado`, { method: "PUT" });
  return res.json();
}

export async function eliminarTarea(id) {
  await fetch(`${BASE}/tareas/${id}`, { method: "DELETE" });
}

export async function editarTarea(id, titulo) {
  await fetch(`${BASE}/tareas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo }),
  });
}

export async function asignarUsuario(idTarea, idUsuario) {
  const res = await fetch(`${BASE}/tareas/${idTarea}/asignar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: idUsuario }),
  });
  return res.json();
}

// usuarios
export async function obtenerUsuarios() {
  const res = await fetch(`${BASE}/usuarios`);
  return res.json();
}

export async function crearUsuario(usuario) {
  const res = await fetch(`${BASE}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return res.json();
}

export async function eliminarUsuario(id) {
  await fetch(`${BASE}/usuarios/${id}`, { method: "DELETE" });
}