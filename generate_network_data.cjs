const fs = require('fs');

// Carrega dados existentes
const dadosPorMes = JSON.parse(fs.readFileSync('./dados_por_mes.json', 'utf8'));

// Função para gerar IDs únicos de empresas
function generateCompanyId(cluster, index) {
  return `${cluster.name.substring(0, 3)}_${String(index).padStart(4, '0')}`;
}

// Função para calcular probabilidade de transação entre clusters
function getTransactionProbability(clusterA, clusterB) {
  const probabilities = {
    'INÍCIO': { 'INÍCIO': 0.3, 'EXPANSÃO': 0.4, 'MATURIDADE': 0.2, 'DECLÍNIO': 0.1 },
    'EXPANSÃO': { 'INÍCIO': 0.2, 'EXPANSÃO': 0.3, 'MATURIDADE': 0.4, 'DECLÍNIO': 0.1 },
    'MATURIDADE': { 'INÍCIO': 0.1, 'EXPANSÃO': 0.3, 'MATURIDADE': 0.5, 'DECLÍNIO': 0.1 },
    'DECLÍNIO': { 'INÍCIO': 0.3, 'EXPANSÃO': 0.2, 'MATURIDADE': 0.3, 'DECLÍNIO': 0.2 }
  };
  return probabilities[clusterA][clusterB] || 0.1;
}

// Função para gerar valor de transação baseado nos clusters
function generateTransactionValue(clusterFrom, clusterTo) {
  const baseValues = {
    'INÍCIO': { min: 1000, max: 50000 },
    'EXPANSÃO': { min: 10000, max: 500000 },
    'MATURIDADE': { min: 50000, max: 2000000 },
    'DECLÍNIO': { min: 500, max: 25000 }
  };

  const fromRange = baseValues[clusterFrom];
  const toRange = baseValues[clusterTo];

  // Média dos ranges
  const avgMin = (fromRange.min + toRange.min) / 2;
  const avgMax = (fromRange.max + toRange.max) / 2;

  return Math.floor(Math.random() * (avgMax - avgMin) + avgMin);
}

// Gera rede para um mês específico
function generateNetworkForMonth(monthData, monthKey, sampleSize = 200) {
  console.log(`Gerando rede para ${monthKey}...`);

  const companies = [];
  const transactions = [];

  // Criar empresas representativas de cada cluster
  monthData.clusters.forEach((cluster, clusterIndex) => {
    const companiesInCluster = Math.floor((cluster.count / monthData.stats.total_empresas) * sampleSize);

    for (let i = 0; i < companiesInCluster; i++) {
      const company = {
        id: generateCompanyId(cluster, companies.length),
        cluster: cluster.name,
        clusterId: cluster.id,
        faturamento: cluster.faturamento_medio * (0.5 + Math.random()),
        saldo: cluster.saldo_medio * (0.5 + Math.random()),
        transacoesMedia: cluster.transacoes_medio,
        entradaMedia: cluster.entrada_media || 0,
        saidaMedia: cluster.saida_media || 0
      };
      companies.push(company);
    }
  });

  // Gerar transações entre empresas
  const numTransactions = Math.floor(sampleSize * 1.5); // 1.5 transações por empresa em média

  for (let i = 0; i < numTransactions; i++) {
    const fromCompany = companies[Math.floor(Math.random() * companies.length)];
    const toCompany = companies[Math.floor(Math.random() * companies.length)];

    if (fromCompany.id !== toCompany.id) {
      const probability = getTransactionProbability(fromCompany.cluster, toCompany.cluster);

      if (Math.random() < probability) {
        const transaction = {
          id: `TXN_${i.toString().padStart(6, '0')}`,
          from: fromCompany.id,
          to: toCompany.id,
          fromCluster: fromCompany.cluster,
          toCluster: toCompany.cluster,
          value: generateTransactionValue(fromCompany.cluster, toCompany.cluster),
          timestamp: monthKey === 'todos' ?
            new Date(2025, 5, Math.floor(Math.random() * 28) + 1).toISOString() :
            new Date(2025, parseInt(monthKey.split('-')[1]) - 1, Math.floor(Math.random() * 28) + 1).toISOString()
        };
        transactions.push(transaction);
      }
    }
  }

  return {
    companies,
    transactions,
    stats: {
      totalCompanies: companies.length,
      totalTransactions: transactions.length,
      avgTransactionValue: transactions.reduce((sum, t) => sum + t.value, 0) / transactions.length,
      networkDensity: (transactions.length / (companies.length * (companies.length - 1))).toFixed(4)
    }
  };
}

// Gerar dados de rede para todos os meses
const networkData = {};

Object.keys(dadosPorMes).forEach(monthKey => {
  if (monthKey !== 'todos' && dadosPorMes[monthKey].stats.total_transacoes > 0) {
    networkData[monthKey] = generateNetworkForMonth(dadosPorMes[monthKey], monthKey);
  }
});

// Gerar rede consolidada para "todos"
if (dadosPorMes.todos) {
  networkData.todos = generateNetworkForMonth(dadosPorMes.todos, 'todos', 300);
}

// Salvar dados de rede
fs.writeFileSync('./network_data.json', JSON.stringify(networkData, null, 2));

console.log('\n=== Dados de Rede Gerados ===');
Object.keys(networkData).forEach(month => {
  const data = networkData[month];
  console.log(`${month}: ${data.companies.length} empresas, ${data.transactions.length} transações`);
  console.log(`  Densidade da rede: ${data.stats.networkDensity}`);
  console.log(`  Valor médio: R$ ${data.stats.avgTransactionValue.toLocaleString()}`);
});