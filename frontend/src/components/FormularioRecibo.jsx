import {
  Box,
  Button,
  TextField,
  Stack,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import { useState } from 'react';

export default function FormularioRecibo() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [previewURL, setPreviewURL] = useState(null);
  const [previewTipo, setPreviewTipo] = useState('');

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
      setPreviewURL(null);
      setPreviewTipo('');
    } else {
      const err = await response.json();
      setMensagem(`Erro: ${err.detail || 'não foi possível enviar o recibo.'}`);
    }
  };

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      setPreviewURL(URL.createObjectURL(file));
      setPreviewTipo(file.type);
    }
  };

  const renderPreview = () => {
    if (!previewURL) return null;
    if (previewTipo === 'application/pdf') {
      return (
        <embed
          src={previewURL}
          type="application/pdf"
          width="100%"
          height="400px"
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        />
      );
    }
    if (previewTipo.startsWith('image/')) {
      return (
        <img
          src={previewURL}
          alt="Pré-visualização"
          style={{ width: '100%', maxHeight: '400px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      );
    }
    return <Typography>Tipo de arquivo não suportado para pré-visualização.</Typography>;
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
                accept=".pdf,image/png,image/jpeg"
                onChange={handleArquivoChange}
              />
              <Button variant="contained" color="primary" type="submit">
                Enviar Recibo
              </Button>
              {mensagem && <Typography>{mensagem}</Typography>}
            </Stack>
          </Box>
        </Grid>

        {previewURL && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Pré-visualização do Arquivo
            </Typography>
            {renderPreview()}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
