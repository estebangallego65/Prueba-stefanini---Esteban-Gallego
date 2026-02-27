import Chip from "@mui/material/Chip";

const CONFIG = {
  TODO:        { label: "Por hacer",   color: "default"  },
  IN_PROGRESS: { label: "En progreso", color: "warning"  },
  DONE:        { label: "Completada",  color: "success"  },
};

function EstadoBadge({ estado }) {
  const { label, color } = CONFIG[estado] || { label: estado, color: "default" };
  return <Chip label={label} color={color} size="small" variant="outlined" />;
}

export default EstadoBadge;