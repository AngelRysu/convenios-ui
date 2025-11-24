import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Link,
  Avatar,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import Paso1 from "./paso1";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormEmpresa from "./formEmpresa";
import FormDependencia from "./formDependencia";
import FormPersona from "./FormPersona";

interface PasosProps {
  paso: number,
  setPaso: (paso: number) => void;
}

export default function ConveniosPasos({paso, setPaso}: PasosProps) {
  const navigate = useNavigate();
  
  const [tipoOrganizacion, setTipoOrganizacion] = useState("Empresa");
  const titulos = ["", 
    "Asistente para nuevos Convenios", 
    "Datos de la Organización",
    "Paso 3",
    "Paso 4",
    "Paso 5"
  ];

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      {/* 1. SECCIÓN DEL ENCABEZADO Y PASOS (STEPPER) */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 4 }} // Margen inferior
      >
        <Avatar sx={{ bgcolor: "primary.main", color: "white", width: 40, height: 40 }}>
          {paso}
        </Avatar>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", md: "2rem" }, // Ajuste responsivo
              color: "#1e1e2f",
            }}
          >
            
            {titulos[paso]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Paso {paso} de 5
          </Typography>
        </Box>
      </Stack>

      {paso === 1 && (
        <Paso1 setTipoOrganizacion={setTipoOrganizacion} tipoOrganizacion={tipoOrganizacion} setPaso={setPaso} />
      )}

      {paso === 2 && (
        tipoOrganizacion === "Empresa" ? (
          <FormEmpresa setPaso={setPaso}/>
        ) : tipoOrganizacion === "Dependencia" ? (
          <FormDependencia setPaso={setPaso}/>
        ) : tipoOrganizacion === "Persona Fisica" ? ( // <-- La nueva condición
          <FormPersona setPaso={setPaso}/>
        ) : null
      )}

      {paso === 3 && (
        <>
          <h5>Paso 3</h5>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setPaso(4)}
            sx={{
              mt: 2,
              padding: "10px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none", // Evita que el texto sea mayúsculas
            }}
          >
            Continuar
          </Button>
          <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setPaso(2)}
          sx={{
            mt: 2,
            padding: "10px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none", // Evita que el texto sea mayúsculas
          }}
        >
          Regresar
        </Button>
        </>
      )}

      {paso === 4 && (
        <>
          <h5>Paso 4</h5>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setPaso(5)}
            sx={{
              mt: 2,
              padding: "10px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none", // Evita que el texto sea mayúsculas
            }}
          >
            Continuar
          </Button>
          <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setPaso(3)}
          sx={{
            mt: 2,
            padding: "10px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none", // Evita que el texto sea mayúsculas
          }}
        >
          Regresar
        </Button>
        </>
      )}

      {paso === 5 && (
        <>
          <h5>Paso 5</h5>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setPaso(1)}
            sx={{
              mt: 2,
              padding: "10px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none", // Evita que el texto sea mayúsculas
            }}
          >
            Finalizar
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setPaso(4)}
            sx={{
              mt: 2,
              padding: "10px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none", // Evita que el texto sea mayúsculas
            }}
          >
            Regresar
          </Button>
        </>
      )}
      
      {/* 3. ENLACE DE CANCELAR */}
      <Box sx={{ mt: 3, textAlign: "left" }}>
        <Link
          href="#"
          underline="hover"
          onClick={() => navigate("/convenios")}
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            fontWeight: "medium",
          }}
        >
          Cancelar
        </Link>
      </Box>
    </Box>
  );
}