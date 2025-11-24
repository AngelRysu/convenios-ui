import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import pkg from 'dayjs';
const {Dayjs} = pkg;
import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

// Iconos
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InputField from "~/common/TextField/InputField";
import SelectField from "~/common/TextField/SelectField";
import { createRecord, getData } from '~/utils/apiUtils';
import { useAuthContext } from '~/context/AuthContext';

interface FormEmpresaProps {
  setPaso: (paso: number) => void;
}

// Estado inicial del formulario
const initialState = {
  rfc: "",
  razonSocial: "",
  nombreComercial: "",
  nombreTitular: "",
  puestoTitular: "",
  actividades: "",
  numEscritura: "",
  nombreNotario: "",
  numNotaria: "",
  municipioNotaria: "",
  calleNumero: "",
  estado: "14",
  municipio: "",
  cp: "",
  correo: "",
  telefono: "",
};

export default function FormEmpresa({ setPaso }: FormEmpresaProps) {
  // Estado para guardar todos los datos del formulario
  const [testigos, setTestigos] = useState(['']);
  const [form, setForm] = useState(initialState);
  const [fechaCreacion, setFechaCreacion] = useState<Dayjs | null>(null);
  const [estados, setEstado] = useState([]);
  const [municipioNotaria, setMunicipioNotaría] = useState([]);
  const [municipiosDomicilio, setMunicipioDomicilio] = useState([]);

  const { setNoti } = useAuthContext();

  useEffect(() =>  {
    const fetchEstados = async () => {
      const response = await getData({
        endpoint: "/locacion/estados"
      });
      if (response.statusCode === 200 && response.data?.estados) {
        setEstado(response.data.estados);
      }
    }
    fetchEstados();
  }, estados);


  useEffect(() => {
    const fetchMunicipios = async (estado: string) => {
      const response = await getData({
        endpoint: "/locacion/municipios/"+estado
      });
      setMunicipioNotaría(response.data.municipios);
      setMunicipioDomicilio(response.data.municipios);
    }
    fetchMunicipios("14");
  }, municipioNotaria);


  const on = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(s => ({ ...s, [k]: e.target.value }));

  const handleDateChange = (newDate: Dayjs | null) => {
    setFechaCreacion(newDate.format('YYYY-MM-DD'));
  };

  const handleAddTestigo = () => {
    setTestigos([...testigos, '']);
  };

  const handleRemoveTestigo = (index: number) => {
    setTestigos(testigos.filter((_, i) => i !== index));
  };

  const fetchMunicipiosDomicilio = async (estado: string) => {
    const response = await getData({
      endpoint: "/locacion/municipios/"+estado
    });
    setMunicipioDomicilio(response.data.municipios);
  }

  const handleChangeEstado = async (estado: string) => {
    setForm(s => ({ ...s, estado: estado}));
    setForm(s => ({ ...s, municipio: ""}));
    fetchMunicipiosDomicilio(estado);
  }

  const handleChangeMunicipio = async (municipio: string) => {
    setForm(s => ({ ...s, municipio: municipio}));
  }

  const handleChangeTestigo = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevosValores = [...testigos];
    nuevosValores[index] = event.target.value;

    setTestigos(nuevosValores);
  };

  const handleRegister = async () => {
    const body = {
    	"rfc": form.rfc,
    	"nombre_Legal": form.razonSocial,
      "nombre_Comercial": form.nombreComercial,
      "nombre_Titular": form.nombreTitular,
      "puesto_Titular": form.puestoTitular,
      "numero_Escritura": form.numEscritura,
      "nombre_Notario": form.nombreNotario,
      "numero_Notaria": form.numNotaria,
      "municipio_Notaria": form.municipioNotaria,
      "actividades": form.actividades,
      "domicilio_Calle": form.calleNumero,
      "domicilio_Estado": form.estado,
      "domicilio_Municipio": form.municipio,
      "domicilio_CP": form.cp,
      "contacto_Telefono": form.telefono,
      "contacto_Email": form.correo,
      "oficio_Nombramiento": form.numEscritura,
      "fecha_Nombramiento": fechaCreacion,
      "ine_Representante": "",
      "acta_constitutiva": "",
      "tipo": "Empresa",
    	"testigos": testigos
    }
    const respuesta = await createRecord({ data: body, endpoint: "/organizacion" });
    if(respuesta.statusCode === 201){
      setNoti({
        open: true,
        type: "success",
        message: `Datos de la organización guardados exitosamente`,
      });
      setPaso(3);
    }else{
      setNoti({
        open: true,
        type: "error",
        message: respuesta.errorMessage,
      });
      return;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Información de la Empresa
                </Typography>
            </Grid>
            <Grid size={6}>
              <InputField text="RFC" type="text" size="100%" onChange={on("rfc")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Razón Social (Nombre legal)" type="text" size="100%" onChange={on("razonSocial")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Nombre Comercial" type="text" size="100%" onChange={on("nombreComercial")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Nombre del Titular" size="100%" type="text" onChange={on("nombreTitular")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Puesto del Titular" size="100%" type="text" onChange={on("puestoTitular")}/>
            </Grid>
            <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  onChange={on("actividades")}
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
              <InputField text="Número de Escritura Pública" size="100%" type="text" onChange={on("numEscritura")}/>
            </Grid>
            <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      onChange={handleDateChange}
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
              <InputField text="Nombre del Notario Público" size="100%" type="text" onChange={on("nombreNotario")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Número de Notaría Pública" size="100%" type="text" onChange={on("numNotaria")}/>
            </Grid>
            <Grid size={12}>
              <Box>
                <SelectField
                  label="Municipio de la Notaría Pública"
                  name="municipioNotaria"
                  value={form.municipioNotaria}
                  onChange={(e) => setForm(s => ({ ...s, municipioNotaria: (e.target as HTMLInputElement).value }))}
                  options={municipioNotaria}
                  placeholder="Selecciona un Municipio"
                  helperText={"Selecciona un Municipio"}
                  maxWidth="100%"
                />
              </Box>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Domicilio de la Empresa
                </Typography>
            </Grid>
            <Grid size={12}>
              <InputField text="Calle y Número" size="100%" type="text" onChange={on("calleNumero")}/>
            </Grid>
            <Grid size={6}>
              <Box>
                <SelectField
                  label="Estado"
                  name="estado"
                  options={estados}
                  value={form.estado}
                  onChange={(e) => handleChangeEstado(e.target.value)}
                  placeholder="Selecciona un Estado"
                  helperText={"Selecciona un Estado"}
                  maxWidth="100%"
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <Box>
                <SelectField
                  label="Municipio"
                  name="municipio"
                  value={form.municipio}
                  onChange={(e) => handleChangeMunicipio(e.target.value)}
                  options={municipiosDomicilio}
                  placeholder="Selecciona un Municipio"
                  helperText={"Selecciona un Municipio"}
                  maxWidth="100%"
                />
              </Box>
            </Grid>
            <Grid size={6}>
              <InputField text="Código Postal (CP)" size="100%" type="text" onChange={on("cp")}/>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Información de Contacto
              </Typography>
            </Grid>
            <Grid size={6}>
              <InputField text="Correo Electronico" size="100%" type="text" onChange={on("correo")}/>
            </Grid>
            <Grid size={6}>
              <InputField text="Teléfono" size="100%" type="text" onChange={on("telefono")}/>
            </Grid>
            <Grid size={12} sx={{borderBottom: '1px solid #cacacaff'}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Testigos del Convenio
              </Typography>
            </Grid>
            {testigos.map((valor, index) => (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={`Nombre completo del Testigo ${index + 1}`}
                  value={valor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleChangeTestigo(index, e)}}
                  name={`testigo${index + 1}`}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" color="error" onClick={() => {handleRemoveTestigo(index)}}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
            <Grid size={12}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                sx={{ textTransform: "none", mt: 1 }}
                onClick={() => handleAddTestigo()}
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
                    handleRegister()
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