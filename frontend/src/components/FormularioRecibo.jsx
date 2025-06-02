import {
  Box,
  Button,
  TextField,
  Stack,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function FormularioRecibo() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!arquivo) {
      setMensagem('Selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('valor', valor);
    formData.append('descricao', descricao);
    formData.append('arquivo', arquivo);

    const response = await fetch('http://localhost:8000/recibos/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setMensagem('Recibo enviado com sucesso!');
      setTitulo('');
      setValor('');
      setDescricao('');
      setArquivo(null);
    } else {
      const err = await response.json();
      setMensagem(`Erro: ${err.detail || 'não foi possível enviar o recibo.'}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Título"
            variant="outlined"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
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
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setArquivo(e.target.files[0])}
          />
          <Button variant="contained" color="primary" type="submit">
            Enviar Recibo
          </Button>
          {mensagem && <Typography>{mensagem}</Typography>}
        </Stack>
      </Box>
    </Paper>
  );
}
