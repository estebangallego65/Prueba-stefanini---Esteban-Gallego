import { Box, Grid, Typography, Divider, Paper } from "@mui/material";
import TarjetaTarea from "./TarjetaTarea";

const COLUMNAS = [
  { estado: "TODO",        label: "Por hacer",   color: "#6b6b8a" },
  { estado: "IN_PROGRESS", label: "En progreso", color: "#f59e0b" },
  { estado: "DONE",        label: "Completadas", color: "#10b981" },
];

function EmptyState({ mensaje }) {
  return (
    <Box textAlign="center" py={8}>
      <Typography fontSize={40} mb={1}>📋</Typography>
      <Typography color="text.secondary" variant="body2">{mensaje}</Typography>
      <Typography color="text.disabled" variant="caption">
        Crea una tarea usando el botón de arriba.
      </Typography>
    </Box>
  );
}

function ListaTareas({ tareas, listaUsuarios, cambiarEstado, eliminar, asignar, vistaKanban }) {

  if (tareas.length === 0) {
    return <EmptyState mensaje="No hay tareas aquí." />;
  }

  if (vistaKanban) {
    return (
      <Grid container spacing={3}>
        {COLUMNAS.map(col => {
          const grupo = tareas.filter(t => t.estado === col.estado);
          return (
            <Grid item xs={12} md={4} key={col.estado}>
              {/* Header columna */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: col.color }}
                />
                <Typography variant="caption" fontWeight={600} color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  {col.label}
                </Typography>
                <Paper variant="outlined" sx={{ ml: "auto", px: 1, py: 0.2, borderRadius: 99 }}>
                  <Typography variant="caption">{grupo.length}</Typography>
                </Paper>
              </Box>

              <Divider sx={{ mb: 2, borderColor: col.color + "44" }} />

              {/* Tarjetas */}
              <Box display="flex" flexDirection="column" gap={2}>
                {grupo.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3, textAlign: "center",
                      borderStyle: "dashed", borderColor: "divider"
                    }}
                  >
                    <Typography variant="caption" color="text.disabled">Vacío</Typography>
                  </Paper>
                ) : (
                  grupo.map(t => (
                    <TarjetaTarea
                      key={t.id}
                      tarea={t}
                      listaUsuarios={listaUsuarios}
                      cambiarEstado={cambiarEstado}
                      eliminar={eliminar}
                      asignar={asignar}
                    />
                  ))
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  // Vista lista
  return (
    <Grid container spacing={2}>
      {tareas.map(t => (
        <Grid item xs={12} sm={6} lg={4} key={t.id}>
          <TarjetaTarea
            tarea={t}
            listaUsuarios={listaUsuarios}
            cambiarEstado={cambiarEstado}
            eliminar={eliminar}
            asignar={asignar}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ListaTareas;