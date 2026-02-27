import { useState } from "react";
import {
  Drawer, Box, Typography, Stack, Avatar, IconButton,
  Divider, Button, Tooltip, List, ListItem, ListItemAvatar,
  ListItemText, Collapse
} from "@mui/material";
import CloseIcon       from "@mui/icons-material/Close";
import PersonAddIcon   from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormularioUsuario from "./FormularioUsuario";
import { eliminarUsuario } from "../servicios/tareasServicio";

function PanelUsuarios({ abierto, onCerrar, usuarios, onActualizar }) {
  const [mostrarForm, setMostrarForm] = useState(false);

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await eliminarUsuario(id);
    onActualizar();
  }

  return (
    <Drawer
      anchor="right"
      open={abierto}
      onClose={onCerrar}
      PaperProps={{
        sx: { width: 340, bgcolor: "background.paper", p: 0 }
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          👥 Equipo
        </Typography>
        <IconButton size="small" onClick={onCerrar}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Lista de usuarios */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pt: 1 }}>
        <Typography variant="caption" color="text.secondary"
          sx={{ px: 1, display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 1 }}>
          Miembros ({usuarios.length})
        </Typography>

        {usuarios.length === 0 ? (
          <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
            No hay usuarios aún.
          </Typography>
        ) : (
          <List dense disablePadding>
            {usuarios.map(u => (
              <ListItem
                key={u.id_usuario}
                secondaryAction={
                  <Tooltip title="Eliminar">
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={() => handleEliminar(u.id_usuario)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{
                  borderRadius: 2, mb: 0.5,
                  "&:hover": { bgcolor: "action.hover" }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark", fontSize: 13 }}>
                    {u.nombre[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={u.nombre}
                  secondary={u.correo || "Sin correo"}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider />

      {/* Formulario nuevo usuario */}
      <Box sx={{ px: 3, py: 2 }}>
        <Collapse in={mostrarForm}>
          <Typography variant="caption" color="text.secondary"
            sx={{ display: "block", mb: 1.5, textTransform: "uppercase", letterSpacing: 1 }}>
            Nuevo miembro
          </Typography>
          <FormularioUsuario
            onCreado={onActualizar}
            onCerrar={() => setMostrarForm(false)}
          />
        </Collapse>

        {!mostrarForm && (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setMostrarForm(true)}
          >
            Agregar miembro
          </Button>
        )}
      </Box>
    </Drawer>
  );
}

export default PanelUsuarios;