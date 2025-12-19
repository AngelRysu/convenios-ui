import {
  Box,
  Typography,
  Button,
  Link,
  Avatar,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import Paso1 from "./paso1";
import Paso4 from "./paso4";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormEmpresa from "./formEmpresa";
import FormDependencia from "./formDependencia";
import FormPersona from "./FormPersona";

interface PasosProps {
  paso: number;
  setPaso: (paso: number) => void;
}

export default function ConveniosPasos({ paso, setPaso }: PasosProps) {
  const navigate = useNavigate();

  // --- ESTADOS COMPARTIDOS ---
  const [tipoOrganizacion, setTipoOrganizacion] = useState("Empresa");
  const [folio, setFolio] = useState<string>("");
  const [idConvenio, setIdConvenio] = useState<number | string>("");

  const titulos = [
    "",
    "Asistente para nuevos Convenios",
    "Datos de la Organización",
    "Paso 3",
    "Anexos y Documentos",
    "Paso 5",
  ];

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      {/* 1. SECCIÓN DEL ENCABEZADO Y PASOS */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", color: "white", width: 40, height: 40 }}>
          {paso}
        </Avatar>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", md: "2rem" },
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

      {/* --- PASO 1: Selección de Tipo --- */}
      {paso === 1 && (
        <Paso1
          setTipoOrganizacion={setTipoOrganizacion}
          tipoOrganizacion={tipoOrganizacion}
          setPaso={setPaso}
        />
      )}

      {/* --- PASO 2: Formularios (Aquí es donde debes setear el Folio e ID al guardar) --- */}
      {paso === 2 && (
        <>
          {tipoOrganizacion === "Empresa" && (
            <FormEmpresa 
              setPaso={setPaso} 
            />
          )}
          {tipoOrganizacion === "Dependencia" && (
            <FormDependencia 
              setPaso={setPaso} 
            />
          )}
          {tipoOrganizacion === "Persona Fisica" && (
            <FormPersona 
              setPaso={setPaso} 
            />
          )}
        </>
      )}

      {/* --- PASO 3: Otros Datos --- */}
      {paso === 3 && (
        <Box>
          <Typography variant="h6">Contenido del Paso 3</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setPaso(2)}
            >
              Regresar
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setPaso(4)}
            >
              Continuar
            </Button>
          </Stack>
        </Box>
      )}

      {/* --- PASO 4: Documentación (Recibe los datos guardados) --- */}
      {paso === 4 && (
        <Paso4 
            setPaso={setPaso}
            folio={folio}
            idConvenio={idConvenio as any}
            tipoOrganizacion={tipoOrganizacion as any}
        />
      )}

      {/* --- PASO 5: Finalización --- */}
      {paso === 5 && (
        <Box>
          <Typography variant="h6">Paso 5 - Finalizar</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setPaso(4)}
            >
              Regresar
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/convenios")}
            >
              Finalizar
            </Button>
          </Stack>
        </Box>
      )}

      {/* 3. ENLACE DE CANCELAR */}
      <Box sx={{ mt: 3, textAlign: "left" }}>
        <Link
          component="button"
          onClick={() => navigate("/convenios")}
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            fontWeight: "medium",
            textDecoration: "none",
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Cancelar
        </Link>
      </Box>
    </Box>
  );
}