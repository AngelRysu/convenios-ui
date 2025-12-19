import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useAuthContext } from '~/context/AuthContext';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/Paso3.css';

interface FormPersonaProps {
  setPaso: (paso: number) => void;
}

const TINYMCE_TOKEN = import.meta.env.VITE_TINYMCE_TOKEN;
const BACK_URL = import.meta.env.VITE_PUBLIC_URL;

export default function Paso3({ setPaso }: FormPersonaProps) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [disabled, setDisabled] = useState(true);

  const { setNoti } = useAuthContext();

  const log = () => {
    if (editorRef.current) {
      const contenido = editorRef.current.getContent();
      console.log(contenido);
    }
  };

  const getHtml = async () => {
    const cuerpo = {
      nombre: "uripunkas",
      nombre_unidad: "Zapopan",
      nombre_empresa: "Chupones de mangera A.C.",
      nombre_jefe: "HUGOD",
      puesto: "Jefe de Jefes",
      nombre_comercial: "Chupones de Manguera",
      nombre_director: "Don Chupon",
      acuerdo: "SXAL/0484/56549",
      fecha: "Lunes 4 de Diciembre del 2025",
      domicilio: "BLVD de los chupones 1234, Chupones, Jalisco",
      telefono: "3315752741",
      mail: "chupones@manguera.com",
      numero_Escritura: "158484845",
      fecha_nombramiento: "Lunes 4 de Diciembre del 2025",
      nombre_notario: "Hermano de Don Xupon",
      numero_notaria: "87849965965",
      municipio_notaria: "Chupones",
      actividades: "Hacer chupones de manguera a nuestros clientes"
    }

    const response = await fetch(BACK_URL + '/convenios/empresa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    });
    const data = await response.json();

    if (editorRef && editorRef.current) {
      editorRef.current.setContent(data.html);
    }
  }

  const handleButtonClick = async () => {
    if (!editorRef.current) return;
    
    // 1. Obtener el HTML actual del editor
    const htmlContent = editorRef.current.getContent();
    console.log(htmlContent);
    try {
      const response = await fetch(BACK_URL + '/convenios/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      // 2. Convertir la respuesta a un Blob (archivo binario)
      const blob = await response.blob();

      // 3. Crear una URL temporal para el archivo
      const url = window.URL.createObjectURL(blob);

      // 4. Crear un enlace "fantasma" y simular el clic para descargar
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'convenio.pdf'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();

      // 5. Limpieza
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    }catch(error){
      console.error(error);
      setNoti({
        open: true,
        type: 'error',
        message: 'No se pudo descargar el PDF',
      });
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];

    // Verificar si se seleccionó un archivo
    if (!file) {
      setNoti({
        open: true,
        type: 'error',
        message: 'No se subió el archivo',
      });
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(BACK_URL + '/organizacion/archivo', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        if (editorRef && editorRef.current) {
          editorRef.current.setContent(data.html);
        }
      } else {
        setNoti({
          open: true,
          type: 'error',
          message: 'Ha ocurrido un error procesando el archivo',
        });
      }
    } catch (err) {
      setNoti({
        open: true,
        type: 'error',
        message: 'Ha ocurrido un error procesando el archivo',
      });
    }
    console.log('sube archivo');
  };

  return (
    <>
      {/* Lado Derecho: Botones de Personalizar y Descargar PDF */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px',
        }}
      >
        <Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setDisabled(!disabled)}
            sx={{
              mt: 2,
              mr: 2,
              padding: '10px 24px',
              backgroundColor: '#fff',
              color: '#000',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none', // Evita que el texto sea mayúsculas
            }}
          >
            {disabled ? 'Personalizar' : 'Bloquear'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".docx"
            style={{ display: 'none' }}
            onChange={handleFileUpload} // Aquí se adjunta la función
          />
          <Button
            variant="contained"
            color="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleButtonClick}
            sx={{
              mt: 2,
              mr: 2,
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none', // Evita que el texto sea mayúsculas
            }}
          >
            Descargar PDF
          </Button>
        </Box>
      </Box>
        <Editor
          apiKey={TINYMCE_TOKEN}
          onInit={(_evt, editor) => {
            editorRef.current = editor;
            getHtml();
          }}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Arial,sans-serif; font-size:14px }',
          }}
          disabled={disabled}
        />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
        }}
      >
        {/* Botones de Regresar y Continuar */}
        <Box>
          <Button
            variant="outlined" // Lo cambié a outlined para diferenciar
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => setPaso(2)}
            sx={{
              mr: 2, // Margen a la derecha
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Regresar
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={log}
            sx={{
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </>
  );
}
