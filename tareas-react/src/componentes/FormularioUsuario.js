import { useState } from "react";
import { TextField, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { crearUsuario } from "../servicios/tareasServicio";

function FormularioUsuario({ onCreado, onCerrar }) {
  const [nombre,    setNombre]    = useState("");
  const [correo,    setCorreo]    = useState("");
  const [error,     setError]     = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setError("");
    setGuardando(true);
    try {
      await crearUsuario({ nombre: nombre.trim(), correo: correo.trim() || null });
      onCreado?.();
      onCerrar?.();
    } catch {
      setError("Error al crear el usuario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <TextField
        label="Nombre *"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        inputProps={{ maxLength: 100 }}
        autoFocus
        fullWidth
        size="small"
        onKeyDown={e => e.key === "Enter" && guardar()}
      />

      <TextField
        label="Correo"
        type="email"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        fullWidth
        size="small"
      />

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
          {guardando ? "Creando..." : "Agregar"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default FormularioUsuario;