import React, { useState, useRef, useEffect } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import networkDataJSON from '../network_data.json';

const NetworkAnalysis = () => {
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [selectedMetric, setSelectedMetric] = useState('degree');
  const [networkData, setNetworkData] = useState(networkDataJSON);
  const [networkStats, setNetworkStats] = useState(null);
  const networkContainer = useRef(null);
  const networkInstance = useRef(null);

  const monthOptions = [
    { value: 'todos', label: 'Todos os Meses' },
    { value: '2025-03', label: 'Março 2025' },
    { value: '2025-04', label: 'Abril 2025' },
    { value: '2025-05', label: 'Maio 2025' }
  ];

  const metricOptions = [
    { value: 'degree', label: 'Centralidade de Grau' },
    { value: 'betweenness', label: 'Centralidade de Intermediação' },
    { value: 'closeness', label: 'Centralidade de Proximidade' },
    { value: 'cluster', label: 'Por Cluster de Negócio' }
  ];

  // Calcula métricas de centralidade
  const calculateCentralityMetrics = (companies, transactions) => {
    const metrics = {};

    companies.forEach(company => {
      // Degree Centrality (número de conexões)
      const connections = transactions.filter(t => t.from === company.id || t.to === company.id);
      metrics[company.id] = {
        ...company,
        degree: connections.length,
        inDegree: transactions.filter(t => t.to === company.id).length,
        outDegree: transactions.filter(t => t.from === company.id).length,
        totalValue: connections.reduce((sum, t) => sum + t.value, 0)
      };
    });

    // Normaliza métricas para scale 0-1
    const maxDegree = Math.max(...Object.values(metrics).map(m => m.degree));
    const maxValue = Math.max(...Object.values(metrics).map(m => m.totalValue));

    Object.keys(metrics).forEach(id => {
      metrics[id].normalizedDegree = metrics[id].degree / maxDegree;
      metrics[id].normalizedValue = metrics[id].totalValue / maxValue;
    });

    return metrics;
  };

  // Detecta comunidades (clustering baseado em transações)
  const detectCommunities = (companies, transactions) => {
    const communities = {};

    companies.forEach(company => {
      const partners = new Set();
      transactions.forEach(t => {
        if (t.from === company.id) partners.add(t.to);
        if (t.to === company.id) partners.add(t.from);
      });

      communities[company.id] = {
        partners: Array.from(partners),
        cluster: company.cluster,
        communitySize: partners.size
      };
    });

    return communities;
  };

  // Identifica empresas-chave (hubs)
  const identifyHubs = (metrics) => {
    const sorted = Object.values(metrics).sort((a, b) => b.degree - a.degree);
    return {
      topHubs: sorted.slice(0, 5),
      mostConnected: sorted.filter(m => m.degree >= sorted[0].degree * 0.7),
      highestValue: sorted.sort((a, b) => b.totalValue - a.totalValue).slice(0, 5)
    };
  };

  // Prepara dados para visualização
  const prepareNetworkVisualization = (companies, transactions, metrics) => {
    const clusterColors = {
      'INÍCIO': '#EC0000',
      'EXPANSÃO': '#FF4D4D',
      'MATURIDADE': '#FF8080',
      'DECLÍNIO': '#FFB3B3'
    };

    // Nós (empresas)
    const nodes = new DataSet(companies.map(company => {
      const metric = metrics[company.id];
      const size = selectedMetric === 'degree' ?
        10 + metric.normalizedDegree * 30 :
        10 + metric.normalizedValue * 30;

      return {
        id: company.id,
        label: company.id.substring(0, 7),
        title: `${company.cluster}\nFaturamento: R$ ${company.faturamento.toLocaleString()}\nConexões: ${metric.degree}\nVolume: R$ ${metric.totalValue.toLocaleString()}`,
        color: clusterColors[company.cluster] || '#999999',
        size: size,
        cluster: company.cluster
      };
    }));

    // Arestas (transações)
    const edges = new DataSet(transactions.map(transaction => ({
      id: transaction.id,
      from: transaction.from,
      to: transaction.to,
      width: Math.max(1, transaction.value / 200000),
      label: `R$ ${(transaction.value / 1000).toFixed(0)}k`,
      title: `De: ${transaction.fromCluster}\nPara: ${transaction.toCluster}\nValor: R$ ${transaction.value.toLocaleString()}`,
      color: { opacity: 0.6 }
    })));

    return { nodes, edges };
  };

  // Calcula estatísticas da rede
  const calculateNetworkStats = (companies, transactions, metrics, communities) => {
    const hubs = identifyHubs(metrics);

    return {
      totalNodes: companies.length,
      totalEdges: transactions.length,
      density: (transactions.length / (companies.length * (companies.length - 1))).toFixed(4),
      avgDegree: (Object.values(metrics).reduce((sum, m) => sum + m.degree, 0) / companies.length).toFixed(1),
      totalVolume: transactions.reduce((sum, t) => sum + t.value, 0),
      avgTransactionValue: transactions.reduce((sum, t) => sum + t.value, 0) / transactions.length,
      topHubs: hubs.topHubs,
      communities: Object.keys(communities).length,
      clusterDistribution: companies.reduce((dist, c) => {
        dist[c.cluster] = (dist[c.cluster] || 0) + 1;
        return dist;
      }, {})
    };
  };

  // Renderiza network quando dados mudam
  useEffect(() => {
    if (!networkContainer.current || !networkData[selectedMonth]) return;

    const currentData = networkData[selectedMonth];
    const metrics = calculateCentralityMetrics(currentData.companies, currentData.transactions);
    const communities = detectCommunities(currentData.companies, currentData.transactions);
    const stats = calculateNetworkStats(currentData.companies, currentData.transactions, metrics, communities);

    setNetworkStats(stats);

    const { nodes, edges } = prepareNetworkVisualization(currentData.companies, currentData.transactions, metrics);

    const options = {
      nodes: {
        borderWidth: 2,
        borderColor: '#ffffff',
        font: { size: 12, color: '#333333' }
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        font: { size: 10, align: 'middle' },
        smooth: { enabled: true, type: 'dynamic' }
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 100 },
        barnesHut: {
          gravitationalConstant: -30000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      }
    };

    if (networkInstance.current) {
      networkInstance.current.destroy();
    }

    networkInstance.current = new Network(networkContainer.current, { nodes, edges }, options);

  }, [selectedMonth, selectedMetric, networkData]);

  const currentData = networkData[selectedMonth];

  if (!currentData) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 text-xl font-bold">Dados de rede não disponíveis para este período</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl mb-6 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Análise de Redes Transacionais</h1>
          <p className="text-red-100">Mapeamento de relacionamentos e fluxos financeiros entre empresas PJ</p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período de Análise:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Métrica de Visualização:</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {metricOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas da Rede */}
        {networkStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{networkStats.totalNodes}</div>
              <div className="text-sm text-gray-600">Empresas na Rede</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{networkStats.totalEdges}</div>
              <div className="text-sm text-gray-600">Transações</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{networkStats.avgDegree}</div>
              <div className="text-sm text-gray-600">Conexões Médias</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{networkStats.density}</div>
              <div className="text-sm text-gray-600">Densidade da Rede</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Visualização da Rede */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Mapa da Rede Transacional</h3>
              <p className="text-sm text-gray-600">Tamanho dos nós = {metricOptions.find(m => m.value === selectedMetric)?.label}</p>
            </div>
            <div className="p-4">
              <div
                ref={networkContainer}
                style={{ height: '500px', width: '100%' }}
                className="border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Insights e Métricas */}
          <div className="space-y-4">

            {/* Top Hubs */}
            {networkStats?.topHubs && (
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🏢 Empresas-Chave (Hubs)</h4>
                <div className="space-y-2">
                  {networkStats.topHubs.slice(0, 3).map((hub, index) => (
                    <div key={hub.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{hub.id.substring(0, 10)}</div>
                        <div className="text-xs text-gray-600">{hub.cluster}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">{hub.degree}</div>
                        <div className="text-xs text-gray-600">conexões</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribuição por Cluster */}
            {networkStats?.clusterDistribution && (
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📊 Distribuição por Cluster</h4>
                <div className="space-y-2">
                  {Object.entries(networkStats.clusterDistribution).map(([cluster, count]) => (
                    <div key={cluster} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{cluster}</span>
                      <span className="text-sm text-gray-600">{count} empresas</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Métricas Financeiras */}
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">💰 Métricas Financeiras</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volume Total:</span>
                  <span className="text-sm font-bold">R$ {(networkStats?.totalVolume / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ticket Médio:</span>
                  <span className="text-sm font-bold">R$ {(networkStats?.avgTransactionValue / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>

            {/* Insights de Risco */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Análise de Riscos</h4>
              <div className="text-sm text-yellow-700">
                <p className="mb-2">• Empresas com alta centralidade podem criar riscos sistêmicos</p>
                <p className="mb-2">• Clusters DECLÍNIO requerem monitoramento especial</p>
                <p>• Densidade baixa indica oportunidades de crescimento da rede</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalysis;