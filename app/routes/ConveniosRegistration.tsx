import { Box, Typography } from "@mui/material";
import ConveniosPasos from "~/components/Convenios/pasos";
import { useState } from "react";


export default function ConveniosRegistartion() {
  const [paso, setPaso] = useState(1);

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "madaniArabicMedium",
          fontSize: "2rem",
          color: "#1e1e2f",
        }}
      >
        Asistente para nuevos Convenios
      </Typography>
      
      <Box  sx={{
        p: { xs: 2.5, md: 3 },
        border: "1px solid #e6e8ef",
        borderRadius: 2,
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
        width: "90%",
        margin: "auto",
      }}>
        <ConveniosPasos paso={paso} setPaso={setPaso}/>
      </Box>
    </>
  )
}
