const API_URL = "https://qullqi-l52k.onrender.com";

export async function listarRecibos() {
  const res = await fetch(`${API_URL}/recibos`);
  return res.json();
}

export async function criarReciboComArquivo(dados, arquivo) {
  const form = new FormData();
  form.append("titulo", dados.titulo);
  form.append("descricao", dados.descricao);
  form.append("valor", dados.valor);
  form.append("arquivo", arquivo);

  const res = await fetch(`${API_URL}/recibos/upload`, {
    method: "POST",
    body: form
  });

  return res.json();
}
