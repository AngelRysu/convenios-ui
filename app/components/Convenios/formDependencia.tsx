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



interface FormDependenciaProps {
  setPaso: (paso: number) => void;
}

export default function FormDependencia({ setPaso }: FormDependenciaProps) {
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={3} columnSpacing={3}>
                <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Información de la Dependencia
                    </Typography>
                </Grid>
                <Grid size={12}>
                  <InputField text="Nombre de la Dependencia" type="text" size="100%" />
                </Grid>
                <Grid size={6}>
                  <InputField text="Representante Legal de la Dependencia" type="text" size="100%"/>
                </Grid>
                <Grid size={6}>
                  <InputField text="Puesto del Representante" size="100%" type="text"/>
                </Grid>
                <Grid size={6}>
                  <InputField text="Número de Nombramiento" size="100%" type="text"/>
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
                        label="Fecha del Nombramiento" />
                      </DemoContainer>
                    </LocalizationProvider>
                </Grid>
                <Grid size={6}>
                  <InputField text="Número de INE del Representante Legal" size="100%" type="text"/>
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