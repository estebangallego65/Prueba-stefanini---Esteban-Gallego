import { useState } from "react";
import {
  Card, CardContent, CardActions, Typography, Button,
  MenuItem, Select, FormControl, InputLabel, Stack,
  IconButton, Tooltip, Collapse, Box, Avatar
} from "@mui/material";
import DeleteOutlineIcon   from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon    from "@mui/icons-material/ArrowForward";
import PersonAddAltIcon    from "@mui/icons-material/PersonAddAlt";
import EstadoBadge from "./EstadoBadge";

function TarjetaTarea({ tarea, listaUsuarios, cambiarEstado, eliminar, asignar }) {
  const [idSeleccionado, setIdSeleccionado] = useState(
    tarea.id_usuario ? String(tarea.id_usuario) : ""
  );
  const [asignando,      setAsignando]      = useState(false);
  const [expandirAssign, setExpandirAssign] = useState(false);

  async function handleAsignar() {
    setAsignando(true);
    await asignar(tarea.id, idSeleccionado ? Number(idSeleccionado) : null);
    setAsignando(false);
    setExpandirAssign(false);
  }

  const siguienteLabel = { TODO: "Iniciar", IN_PROGRESS: "Completar" };

  return (
    <Card
      elevation={0}
      sx={{
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 24px rgba(0,229,204,0.12)",
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
            {tarea.titulo}
          </Typography>
          <EstadoBadge estado={tarea.estado} />
        </Stack>

        {/* Descripción */}
        {tarea.descripcion && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 12 }}>
            {tarea.descripcion}
          </Typography>
        )}

        {/* Usuario asignado */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 22, height: 22, fontSize: 11, bgcolor: "primary.dark" }}>
            {tarea.nombre_usuario ? tarea.nombre_usuario[0].toUpperCase() : "?"}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {tarea.nombre_usuario || "Sin asignar"}
          </Typography>
        </Stack>
      </CardContent>

      {/* Panel de asignación expandible */}
      <Collapse in={expandirAssign}>
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" fullWidth>
              <InputLabel>Usuario</InputLabel>
              <Select
                value={idSeleccionado}
                label="Usuario"
                onChange={e => setIdSeleccionado(e.target.value)}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {listaUsuarios.map(u => (
                  <MenuItem key={u.id_usuario} value={String(u.id_usuario)}>
                    {u.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="small"
              onClick={handleAsignar}
              disabled={asignando}
              sx={{ whiteSpace: "nowrap", minWidth: 80 }}
            >
              {asignando ? "..." : "Guardar"}
            </Button>
          </Stack>
        </Box>
      </Collapse>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        {/* Cambiar estado */}
        {tarea.estado !== "DONE" && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={() => cambiarEstado(tarea.id)}
            sx={{ flex: 1 }}
          >
            {siguienteLabel[tarea.estado]}
          </Button>
        )}

        {/* Asignar */}
        <Tooltip title="Asignar usuario">
          <IconButton
            size="small"
            color={expandirAssign ? "primary" : "default"}
            onClick={() => setExpandirAssign(!expandirAssign)}
          >
            <PersonAddAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Eliminar */}
        <Tooltip title="Eliminar tarea">
          <IconButton
            size="small"
            color="error"
            onClick={() => eliminar(tarea.id)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default TarjetaTarea;