import { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Container, Box, Button,
  Stack, TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent,
  Snackbar, Alert, CircularProgress, ToggleButton,
  ToggleButtonGroup, Chip, Tooltip
} from "@mui/material";
import AddIcon         from "@mui/icons-material/Add";
import ViewKanbanIcon  from "@mui/icons-material/ViewKanban";
import ListIcon        from "@mui/icons-material/ViewList";
import GroupIcon       from "@mui/icons-material/Group";

import ListaTareas      from "../componentes/ListaTareas";
import FormularioTarea  from "../componentes/FormularioTarea";
import PanelUsuarios    from "../componentes/PanelUsuarios";

import {
  obtenerTareas, crearTarea, cambiarEstado,
  eliminarTarea, asignarUsuario, obtenerUsuarios,
} from "../servicios/tareasServicio";

function PantallaTareas() {
  const [tareas,        setTareas]        = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // UI
  const [cargando,      setCargando]      = useState(false);
  const [modalTarea,    setModalTarea]    = useState(false);
  const [panelUsuarios, setPanelUsuarios] = useState(false);
  const [vistaKanban,   setVistaKanban]   = useState(true);

  // Filtros
  const [filtroEstado,  setFiltroEstado]  = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [busqueda,      setBusqueda]      = useState("");

  // Snacbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "error" });
  const mostrarError = msg => setSnack({ open: true, msg, severity: "error" });
  const mostrarOk    = msg => setSnack({ open: true, msg, severity: "success" });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargarTodo(); }, []);

  async function cargarTodo() {
    setCargando(true);
    try {
      const [t, u] = await Promise.all([obtenerTareas(), obtenerUsuarios()]);
      setTareas(t);
      setListaUsuarios(u);
    } catch {
      mostrarError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  async function crear(tarea) {
    try { await crearTarea(tarea); await cargarTodo(); mostrarOk("Tarea creada."); }
    catch { mostrarError("Error al crear la tarea."); }
  }

  async function cambiar(id) {
    try { await cambiarEstado(id); await cargarTodo(); }
    catch { mostrarError("Error al cambiar el estado."); }
  }

  async function eliminar(id) {
    try { await eliminarTarea(id); await cargarTodo(); mostrarOk("Tarea eliminada."); }
    catch { mostrarError("Error al eliminar la tarea."); }
  }

  async function asignar(idTarea, idUsuario) {
    try { await asignarUsuario(idTarea, idUsuario); await cargarTodo(); }
    catch { mostrarError("Error al asignar el usuario."); }
  }

  const tareasFiltradas = tareas.filter(t => {
    const pasaEstado   = filtroEstado  ? t.estado === filtroEstado : true;
    const pasaUsuario  = filtroUsuario ? String(t.id_usuario) === filtroUsuario : true;
    const pasaBusqueda = busqueda
      ? t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return pasaEstado && pasaUsuario && pasaBusqueda;
  });

  const hayFiltros = filtroEstado || filtroUsuario || busqueda;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>

      {/* navbar */}
      <AppBar position="static" color="transparent" elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider", backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" fontWeight={900} color="primary" sx={{ flexGrow: 1 }}>
            ASIGTAREAS
          </Typography>

          {/* Toggle vista */}
          <ToggleButtonGroup
            value={vistaKanban ? "kanban" : "lista"}
            exclusive
            size="small"
            onChange={(_, v) => v && setVistaKanban(v === "kanban")}
          >
            <ToggleButton value="kanban">
              <Tooltip title="Vista Kanban"><ViewKanbanIcon fontSize="small" /></Tooltip>
            </ToggleButton>
            <ToggleButton value="lista">
              <Tooltip title="Vista Lista"><ListIcon fontSize="small" /></Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            size="small"
            onClick={() => setPanelUsuarios(true)}
          >
            Equipo
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setModalTarea(true)}
          >
            Nueva tarea
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* filtros */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} alignItems="center">
          <TextField
            placeholder="Buscar tareas..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Estado</InputLabel>
            <Select value={filtroEstado} label="Estado"
              onChange={e => setFiltroEstado(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="TODO">Por hacer</MenuItem>
              <MenuItem value="IN_PROGRESS">En progreso</MenuItem>
              <MenuItem value="DONE">Completadas</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Usuario</InputLabel>
            <Select value={filtroUsuario} label="Usuario"
              onChange={e => setFiltroUsuario(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {listaUsuarios.map(u => (
                <MenuItem key={u.id_usuario} value={String(u.id_usuario)}>
                  {u.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {hayFiltros && (
            <Chip
              label="Limpiar filtros"
              onDelete={() => { setFiltroEstado(""); setFiltroUsuario(""); setBusqueda(""); }}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>

        {/* contenido */}
        {cargando ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <ListaTareas
            tareas={tareasFiltradas}
            listaUsuarios={listaUsuarios}
            cambiarEstado={cambiar}
            eliminar={eliminar}
            asignar={asignar}
            vistaKanban={vistaKanban}
          />
        )}
      </Container>

      {/* nueva tarea */}
      <Dialog
        open={modalTarea}
        onClose={() => setModalTarea(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "background.paper" } }}
      >
        <DialogTitle>Nueva tarea</DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <FormularioTarea
            crear={crear}
            onCerrar={() => setModalTarea(false)}
          />
        </DialogContent>
      </Dialog>

      {/* usuarios */}
      <PanelUsuarios
        abierto={panelUsuarios}
        onCerrar={() => setPanelUsuarios(false)}
        usuarios={listaUsuarios}
        onActualizar={cargarTodo}
      />

      {/* snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PantallaTareas;