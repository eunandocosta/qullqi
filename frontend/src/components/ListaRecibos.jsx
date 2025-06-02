import { useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
} from '@mui/material';

export default function ListaRecibos() {
  const [recibos, setRecibos] = useState([]);

  const carregarRecibos = async () => {
    const res = await fetch('http://localhost:8000/recibos');
    const data = await res.json();
    setRecibos(data);
  };

  const baixarArquivo = (codigo) => {
    window.open(`http://localhost:8000/recibos/download/${codigo}`, '_blank');
  };

  useEffect(() => {
    carregarRecibos();
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Recibos Cadastrados
      </Typography>
      <List>
        {recibos.map((recibo) => (
          <Box key={recibo.id}>
            <ListItem
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => baixarArquivo(recibo.codigo_unico)}
                >
                  Baixar
                </Button>
              }
            >
              <ListItemText
                primary={`${recibo.titulo} - R$ ${recibo.valor.toFixed(2)}`}
                secondary={new Date(recibo.data_envio).toLocaleDateString()}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
