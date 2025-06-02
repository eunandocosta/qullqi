import FormularioRecibo from './FormularioRecibo';
import ListaRecibos from './ListaRecibos';

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <FormularioRecibo />
      <ListaRecibos />
    </div>
  );
}
