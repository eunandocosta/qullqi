// src/components/FormularioRecibo.jsx
import {
  Box,
  Button,
  TextField,
  Stack,
  Paper,
} from '@mui/material';
import { useState } from 'react';

export default function FormularioRecibo() {
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ cliente, valor, descricao });

    // Resetar os campos após envio
    setCliente('');
    setValor('');
    setDescricao('');
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Nome do Cliente"
            variant="outlined"
            required
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
          <TextField
            label="Valor (R$)"
            variant="outlined"
            type="number"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            Cadastrar Recibo
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
