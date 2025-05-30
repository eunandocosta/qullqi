import { Container, Typography, Box, Button } from '@mui/material';
import FormularioRecibo from './components/FormularioRecibo';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestor de Recibos
        </Typography>
        <FormularioRecibo/>
      </Box>
    </Container>
  );
}
