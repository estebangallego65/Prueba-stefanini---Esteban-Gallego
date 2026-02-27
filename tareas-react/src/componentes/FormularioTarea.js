import { useState, useEffect } from "react";
import {
  TextField, Button, MenuItem, Stack, Alert, CircularProgress
} from "@mui/material";
import { obtenerUsuarios } from "../servicios/tareasServicio";

function FormularioTarea({ crear, onCerrar }) {
  const [titulo,      setTitulo]      = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idUsuario,   setIdUsuario]   = useState("");
  const [usuarios,    setUsuarios]    = useState([]);
  const [error,       setError]       = useState("");
  const [guardando,   setGuardando]   = useState(false);

  useEffect(() => {
    obtenerUsuarios().then(setUsuarios).catch(() => setUsuarios([]));
  }, []);

  async function guardar() {
    if (!titulo.trim())           { setError("El título es obligatorio."); return; }
    if (titulo.trim().length > 100) { setError("Máximo 100 caracteres.");   return; }
    setError("");
    setGuardando(true);
    await crear({
      titulo:      titulo.trim(),
      descripcion: descripcion.trim(),
      estado:      "TODO",
      id_usuario:  idUsuario ? Number(idUsuario) : null,
    });
    setGuardando(false);
    onCerrar?.();
  }

  return (
    <Stack spacing={2.5}>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <TextField
        label="Título *"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        inputProps={{ maxLength: 100 }}
        autoFocus
        fullWidth
        size="small"
        onKeyDown={e => e.key === "Enter" && guardar()}
      />

      <TextField
        label="Descripción"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        multiline
        rows={3}
        inputProps={{ maxLength: 300 }}
        fullWidth
        size="small"
      />

      <TextField
        select
        label="Asignar a"
        value={idUsuario}
        onChange={e => setIdUsuario(e.target.value)}
        fullWidth
        size="small"
      >
        <MenuItem value="">Sin asignar</MenuItem>
        {usuarios.map(u => (
          <MenuItem key={u.id_usuario} value={u.id_usuario}>
            {u.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={1.5}>
        <Button variant="outlined" color="inherit" onClick={onCerrar} fullWidth>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={guardar}
          disabled={guardando}
          fullWidth
          startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {guardando ? "Creando..." : "Crear tarea"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default FormularioTarea;