// Calcula a porcentagem atingida de uma meta
function calcularProgressoMeta(producao, meta) {
  if (meta === 0) return 0;
  return Math.min(100, Math.round((producao / meta) * 100));
}

// Soma total de peças produzidas em um grupo
function somarProducaoGrupo(contagens, grupoId) {
  return contagens
    .filter(c => c.grupoId === grupoId)
    .reduce((total, c) => total + (c.quantidade || 0), 0);
}

// Retorna se a meta foi atingida
function metaAtingida(producao, meta) {
  return producao >= meta;
}

// Converte timestamp (ms) em string legível
function formatarDataHora(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

module.exports = {
  calcularProgressoMeta,
  somarProducaoGrupo,
  metaAtingida,
  formatarDataHora
};
