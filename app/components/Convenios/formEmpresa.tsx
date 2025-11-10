import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState } from "react";

// Iconos
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InputField from "~/common/TextField/InputField";
import SelectField from "~/common/TextField/SelectField";

interface FormEmpresaProps {
  setPaso: (paso: number) => void;
}

// Estado inicial del formulario
const initialState = {
  razonSocial: "",
  nombreComercial: "",
  nombreTitular: "",
  puestoTitular: "",
  actividades: "",
  numEscritura: "",
  fechaCreacion: "",
  nombreNotario: "",
  numNotaria: "",
  municipioNotaria: "Guadalajara", // Valor por defecto de la imagen
  calleNumero: "",
  estado: "Jalisco", // Valor por defecto de la imagen
  municipio: "Guadalajara", // Valor por defecto de la imagen
  cp: "",
  correo: "",
  telefono: "",
  testigo1: "",
  testigo2: "",
};

export default function FormEmpresa({ setPaso }: FormEmpresaProps) {
  // Estado para guardar todos los datos del formulario
  const [formData, setFormData] = useState(initialState);

  // Handler genérico para actualizar el estado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para el DatePicker
  const handleDateChange = (newDate: any) => {
    setFormData((prev) => ({
      ...prev,
      fechaCreacion: newDate,
    }));
  };

  const commonProps = {
    fullWidth: true,
    variant: "outlined",
    slotProps: {
      inputLabel: {
        shrink: true,
        sx: { color: "#32169b", fontFamily: "madaniArabicBold" },
      },
      input: {
        sx: {
          fontFamily: "madaniArabicRegular",
          fontSize: "16px",
          color: "#000",
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Información de la Empresa
                </Typography>
            </Grid>
            <Grid size={6}>
              <InputField text="Razón Social (Nombre legal)" type="text" size="100%" />
            </Grid>
            <Grid size={6}>
              <InputField text="Nombre Comercial" type="text" size="100%"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Nombre del Titular" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Puesto del Titular" size="100%" type="text"/>
            </Grid>
            <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Actividades de la Empresa"
                  name="actividades"
                  margin="normal"
                />
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Datos de Constitución
                </Typography>
            </Grid>
            <Grid size={6}>
              <InputField text="Número de Escritura Pública" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                    sx={{
                        width: "100%",
                        borderRadius: "1dvh",
                        backgroundColor: "transparent",
                        transition: "all 0.2s ease",
                    }}
                    label="Fecha de Creación de la Empresa" />
                  </DemoContainer>
                </LocalizationProvider>
            </Grid>
            <Grid size={6}>
              <InputField text="Nombre del Notario Público" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Número de Notaría Pública" size="100%" type="text"/>
            </Grid>
            <Grid size={12}>
              <InputField text="Municipio de la Notaría Pública" size="100%" type="text"/>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Domicilio de la Empresa
                </Typography>
            </Grid>
            <Grid size={12}>
              <InputField text="Calle y Número" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Estado" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Municipio" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Código Postal (CP)" size="100%" type="text"/>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Información de Contacto
              </Typography>
            </Grid>
            <Grid size={6}>
              <InputField text="Correo Electronico" size="100%" type="text"/>
            </Grid>
            <Grid size={6}>
              <InputField text="Teléfono" size="100%" type="text"/>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Testigos del Convenio
              </Typography>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre completo del Testigo 1"
                name="testigo1"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" color="error">
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre completo del Testigo 2"
                name="testigo2"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" color="error">
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                sx={{ textTransform: "none", mt: 1 }}
              >
                Agregar otro testigo
              </Button>
            </Grid>
            {/* --- BOTONES DE NAVEGACIÓN --- */}
            <Box
              sx={{
                width: "100%", 
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              {/* Botones de Regresar y Continuar */}
              <Box>
                <Button
                  variant="outlined" // Lo cambié a outlined para diferenciar
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setPaso(1)}
                  sx={{
                    mr: 2, // Margen a la derecha
                    padding: "10px 24px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Regresar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    console.log(formData); // Imprime los datos en consola
                    setPaso(3);
                  }}
                  sx={{
                    padding: "10px 24px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          </Grid>
        </Box>
  );
}