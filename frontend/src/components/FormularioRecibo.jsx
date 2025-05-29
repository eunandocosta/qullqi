import { useState } from "react";
import { criarReciboComArquivo } from "../api/recibos";

export default function FormularioRecibo() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [arquivo, setArquivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await criarReciboComArquivo(
        { titulo, descricao, valor },
        arquivo
      );
      alert(`Recibo criado com sucesso!\nCódigo: ${resposta.codigo_unico}`);
      setTitulo("");
      setDescricao("");
      setValor("");
      setArquivo(null);
    } catch (error) {
      alert("Erro ao enviar recibo.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar Recibo</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setArquivo(e.target.files[0])}
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
