const fs = require('fs');

// Lê o arquivo atual
const data = JSON.parse(fs.readFileSync('./dados_por_mes.json', 'utf8'));

// Função para calcular transações totais baseadas nos clusters
function calculateTotalTransactions(clusters) {
  return Math.round(clusters.reduce((total, cluster) => {
    return total + (cluster.count * cluster.transacoes_medio);
  }, 0));
}

// Função para calcular volume total baseado no total de transações e ticket médio
function calculateVolumeTotal(totalTransactions, ticketMedio) {
  return Math.round(totalTransactions * ticketMedio);
}

// Corrige cada período com transações
const monthsWithTransactions = ['2025-03', '2025-04', '2025-05', 'todos'];

monthsWithTransactions.forEach(month => {
  if (data[month] && data[month].stats.total_transacoes > 0) {
    const clusters = data[month].clusters;

    // Calcula transações baseadas nos clusters
    const totalTransactions = calculateTotalTransactions(clusters);

    // Mantém o ticket médio original e ajusta o volume
    const ticketMedio = data[month].stats.ticket_medio;
    const volumeTotal = calculateVolumeTotal(totalTransactions, ticketMedio);

    // Atualiza os stats
    data[month].stats.total_transacoes = totalTransactions;
    data[month].stats.volume_total = volumeTotal;

    console.log(`${month}: ${totalTransactions} transações, Volume: R$ ${volumeTotal.toLocaleString()}`);
  }
});

// Ajusta especificamente "todos" para ser uma média mais realista
if (data.todos) {
  // Calcula média das transações por empresa dos meses individuais
  const mesesAtivos = ['2025-03', '2025-04', '2025-05'];
  const mediaTransacoesPorEmpresa = mesesAtivos.reduce((sum, mes) => {
    return sum + (data[mes].stats.total_transacoes / data[mes].stats.total_empresas);
  }, 0) / mesesAtivos.length;

  // Ajusta "todos" para ter uma média mais realista
  const totalEmpresasTodos = data.todos.stats.total_empresas;
  const novoTotalTransacoes = Math.round(mediaTransacoesPorEmpresa * 1.5 * totalEmpresasTodos); // 1.5x a média
  const ticketMedio = data.todos.stats.ticket_medio;

  data.todos.stats.total_transacoes = novoTotalTransacoes;
  data.todos.stats.volume_total = novoTotalTransacoes * ticketMedio;

  console.log(`Todos (ajustado): ${novoTotalTransacoes} transações, ${(novoTotalTransacoes/totalEmpresasTodos).toFixed(1)} por empresa`);
}

// Salva o arquivo atualizado
fs.writeFileSync('./dados_por_mes.json', JSON.stringify(data, null, 2));
console.log('\nDados transacionais corrigidos com sucesso!');