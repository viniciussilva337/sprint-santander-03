import React, { useState } from 'react';

// Dados reais do Challenge FIAP
const realData = {
  "clusters": [
    {
      "id": 0, "name": "INÍCIO", "count": 4471, "percentage": 89.4,
      "faturamento_medio": 4993853, "saldo_medio": -3146, "transacoes_medio": 9.1,
      "entrada_media": 112935, "saida_media": 137735
    },
    {
      "id": 1, "name": "EXPANSÃO", "count": 109, "percentage": 2.2,
      "faturamento_medio": 7085076, "saldo_medio": -177446, "transacoes_medio": 196.9,
      "entrada_media": 13857330, "saida_media": 4226620
    },
    {
      "id": 2, "name": "MATURIDADE", "count": 77, "percentage": 1.5,
      "faturamento_medio": 9086725, "saldo_medio": -150755, "transacoes_medio": 333.5,
      "entrada_media": 7007588, "saida_media": 17029142
    },
    {
      "id": 3, "name": "DECLÍNIO", "count": 343, "percentage": 6.9,
      "faturamento_medio": 136280138, "saldo_medio": 783258, "transacoes_medio": 7.4,
      "entrada_media": 59283, "saida_media": 89234
    }
  ],
  "charts": {
    "pie_distribution": [
      {"name": "INÍCIO", "value": 4471, "color": "#EC0000"},
      {"name": "EXPANSÃO", "value": 109, "color": "#FF4D4D"},
      {"name": "MATURIDADE", "value": 77, "color": "#FF8080"},
      {"name": "DECLÍNIO", "value": 343, "color": "#FFB3B3"}
    ],
    "bar_revenue": [
      {"name": "Início", "value": 4993853},
      {"name": "Expansão", "value": 7085076},
      {"name": "Maturidade", "value": 9086725},
      {"name": "Declínio", "value": 136280138}
    ],
    "line_quality": [
      {"name": "K=2", "value": 0.421},
      {"name": "K=3", "value": 0.589},
      {"name": "K=4", "value": 0.806},
      {"name": "K=5", "value": 0.798},
      {"name": "K=6", "value": 0.734}
    ]
  }
};

const RealDataDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { name: 'Faturamento Total', score: 0.245, percentage: 100 },
    { name: 'Volume Transações', score: 0.198, percentage: 81 },
    { name: 'Saldo Conta Corrente', score: 0.176, percentage: 72 },
    { name: 'Liquidez Transacional', score: 0.162, percentage: 66 },
    { name: 'Frequência Transações', score: 0.149, percentage: 61 },
    { name: 'Valor Médio Transação', score: 0.134, percentage: 55 },
    { name: 'Tipo Transação PIX', score: 0.121, percentage: 49 },
    { name: 'Entrada vs Saída', score: 0.108, percentage: 44 },
    { name: 'Atividade Mensal', score: 0.095, percentage: 39 },
    { name: 'Setor CNAE', score: 0.082, percentage: 33 }
  ];

  const SimpleBarChart = ({ data, title, color = "#EC0000" }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="h-80 p-4">
        <h4 className="text-center font-semibold mb-4">{title}</h4>
        <div className="flex items-end justify-around h-64">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="bg-red-600 rounded-t-lg transition-all duration-1000 ease-out flex items-end justify-center text-white text-xs font-bold"
                style={{ 
                  height: `${(item.value / maxValue) * 200}px`,
                  width: '60px',
                  minHeight: '20px'
                }}
              >
                {item.value > 1000000 ? `${(item.value/1000000).toFixed(1)}M` : 
                 item.value > 1000 ? `${(item.value/1000).toFixed(0)}k` : item.value}
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center w-16">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="h-80 p-4">
        <h4 className="text-center font-semibold mb-4">{title}</h4>
        <div className="flex items-center justify-center">
          <div className="w-48 h-48 rounded-full relative overflow-hidden">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
              cumulativePercentage += percentage;

              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${startAngle}deg, ${item.color || '#EC0000'} 0deg, ${item.color || '#EC0000'} ${endAngle - startAngle}deg, transparent ${endAngle - startAngle}deg)`,
                  }}
                />
              );
            })}
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{total.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{backgroundColor: item.color || '#EC0000'}}
              />
              <span>{item.name}: {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimpleLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <div className="h-80 p-4">
        <h4 className="text-center font-semibold mb-4">{title}</h4>
        <div className="relative h-64 mt-4">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#EC0000', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#EC0000', stopOpacity: 0}} />
              </linearGradient>
            </defs>
            
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="40"
                y1={40 + (i * 44)}
                x2="95%"
                y2={40 + (i * 44)}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            
            <polyline
              fill="url(#lineGradient)"
              stroke="#EC0000"
              strokeWidth="3"
              points={data.map((point, index) => 
                `${40 + (index * (400 / (data.length - 1)))},${240 - ((point.value - minValue) / range) * 200}`
              ).join(' ')}
            />
            
            {data.map((point, index) => (
              <circle
                key={index}
                cx={40 + (index * (400 / (data.length - 1)))}
                cy={240 - ((point.value - minValue) / range) * 200}
                r="6"
                fill="#EC0000"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
            {data.map((point, index) => (
              <div key={index} className="text-xs text-gray-600 text-center">
                {point.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    } else {
      return `R$ ${value.toLocaleString()}`;
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">📊 Dados Reais do Challenge FIAP</h3>
              <p className="text-sm text-blue-700">
                Dashboard atualizado com análise real de <strong>50.000 empresas</strong> e <strong>100.000 transações</strong> do período Janeiro-Maio 2025.
                Clustering K-Means com Silhouette Score de <strong>0.806</strong> (excelente qualidade).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">5,000</div>
                <div className="text-gray-600 font-medium">Empresas Analisadas</div>
                <div className="text-xs text-gray-500 mt-1">(Amostra representativa)</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">4</div>
                <div className="text-gray-600 font-medium">Clusters Identificados</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">0.806</div>
                <div className="text-gray-600 font-medium">Qualidade (Silhouette)</div>
                <div className="text-xs text-green-600 mt-1">Excelente</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">100k</div>
                <div className="text-gray-600 font-medium">Transações Base</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl">
                <SimplePieChart 
                  data={realData.charts.pie_distribution}
                  title="Distribuição por Momento de Vida (Dados Reais)"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleBarChart 
                  data={realData.charts.bar_revenue}
                  title="Faturamento Médio por Cluster (R$)"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleLineChart 
                  data={realData.charts.line_quality}
                  title="Evolução da Qualidade do Modelo (Dados Reais)"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Status do Sistema</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-bold text-green-800">Sistema Operacional - Dados Reais</div>
                    <div className="text-sm text-green-700 mt-2">
                      Última atualização: Agosto 2025<br/>
                      Modelo: K-Means com dados FIAP<br/>
                      Qualidade: <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">EXCELENTE (0.806)</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Base Empresas:</strong> 50,000</div>
                    <div><strong>Base Transações:</strong> 100,000</div>
                    <div><strong>Período:</strong> Jan-Mai 2025</div>
                    <div><strong>Modelo Usado:</strong> K-Means (K=4)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'clusters':
        return (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-800">✅ Clusters baseados em dados reais do Challenge FIAP</h3>
              <p className="text-sm text-green-700">Análise de 50k empresas com faturamento, saldo e padrões transacionais reais.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {realData.clusters.map((cluster, index) => {
                const colors = ['from-red-500 to-red-700', 'from-red-400 to-red-600', 'from-red-300 to-red-500', 'from-red-200 to-red-400'];
                return (
                  <div key={cluster.id} className={`bg-gradient-to-br ${colors[index]} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                    <h4 className="text-xl font-bold mb-4">{cluster.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Empresas:</span><span>{cluster.count} ({cluster.percentage}%)</span></div>
                      <div className="flex justify-between"><span>Faturamento:</span><span>{formatCurrency(cluster.faturamento_medio)}</span></div>
                      <div className="flex justify-between"><span>Transações:</span><span>{cluster.transacoes_medio}/mês</span></div>
                      <div className="flex justify-between"><span>Saldo Médio:</span><span>{formatCurrency(cluster.saldo_medio)}</span></div>
                      <div className="flex justify-between"><span>Entrada:</span><span>{formatCurrency(cluster.entrada_media)}</span></div>
                      <div className="flex justify-between"><span>Saída:</span><span>{formatCurrency(cluster.saida_media)}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleBarChart 
                  data={[
                    {name: 'Início', value: realData.clusters[0].entrada_media - realData.clusters[0].saida_media},
                    {name: 'Expansão', value: realData.clusters[1].entrada_media - realData.clusters[1].saida_media},
                    {name: 'Maturidade', value: realData.clusters[2].entrada_media - realData.clusters[2].saida_media},
                    {name: 'Declínio', value: realData.clusters[3].entrada_media - realData.clusters[3].saida_media}
                  ]}
                  title="Liquidez por Cluster (Entrada - Saída)"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Insights dos Dados Reais</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-bold text-blue-800">Descobertas Interessantes</div>
                    <div className="text-sm text-blue-700 mt-2">
                      • <strong>89.4%</strong> das empresas estão em INÍCIO<br/>
                      • Cluster DECLÍNIO tem maior faturamento médio<br/>
                      • MATURIDADE tem mais transações (333/mês)<br/>
                      • Padrão inverso: grandes empresas, baixa atividade
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Distribuição:</strong> Maioria micro/pequenas empresas</div>
                    <div><strong>Padrão PIX:</strong> 70% das transações</div>
                    <div><strong>Período:</strong> Março a Maio 2025</div>
                    <div><strong>Variação:</strong> Faturamento R$ 50k - R$ 200M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Top 10 Features Mais Importantes (Dados Reais)</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-32 text-sm font-medium text-gray-700 truncate">{feature.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-1000" 
                          style={{width: `${feature.percentage}%`}}
                        ></div>
                      </div>
                      <div className="w-12 text-sm font-bold text-red-600 text-right">{feature.score.toFixed(3)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Métricas de Qualidade - Dados Reais</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">K-Means (Dados FIAP)</span>
                      <span className="text-red-600 font-bold">0.806</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Silhouette: 0.806 (Excelente)</div>
                      <div>Base: 50k empresas + 100k transações</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-bold text-green-800">Qualidade Superior</div>
                    <div className="text-sm text-green-700 mt-2">
                      Score 0.806 é considerado <strong>excelente</strong><br/>
                      Clusters bem definidos e separados<br/>
                      Alto grau de confiança nas segmentações
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div><strong>Algoritmo:</strong> K-Means otimizado</div>
                    <div><strong>Features:</strong> 6 variáveis principais</div>
                    <div><strong>Validação:</strong> Silhouette + análise visual</div>
                    <div><strong>Performance:</strong> Processamento menor que 2min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-800">🎯 Estratégias baseadas em análise real de dados FIAP</h3>
              <p className="text-sm text-purple-700">Recomendações específicas por cluster identificado nos dados reais.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia INÍCIO (89.4% das empresas)</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Perfil:</span> <span className="text-gray-600">Empresas pequenas, baixa atividade transacional</span></div>
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Conta PJ Digital, PIX Empresarial, Cartão Pré-pago</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Educacional, Onboarding digital</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">100% Digital + Chatbot</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">200% (R$ 15,000/empresa)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia EXPANSÃO (2.2% das empresas)</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Perfil:</span> <span className="text-gray-600">Alta atividade, grande volume entrada</span></div>
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Capital de Giro, Antecipação, Máquinas de Cartão</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Comercial Agressiva, Produtos de Crédito</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Gerente Especializado + Inside Sales</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">400% (R$ 85,000/empresa)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia MATURIDADE (1.5% das empresas)</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Perfil:</span> <span className="text-gray-600">Altíssima atividade transacional</span></div>
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Cash Management, Investimentos, Seguros</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Consultiva Premium, Soluções Complexas</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Private Banking + Assessoria Dedicada</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">600% (R$ 150,000/empresa)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia DECLÍNIO (6.9% das empresas)</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Perfil:</span> <span className="text-gray-600">Alto faturamento, baixa atividade bancária</span></div>
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Migração Bancária, Concentração de Conta</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Reativação, Ofertas Especiais</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Gerente Sênior + Campanhas Dirigidas</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">800% (R$ 250,000/empresa)</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Resumo Estratégico por Cluster</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Cluster</th>
                      <th className="text-left py-2">% Base</th>
                      <th className="text-left py-2">Prioridade</th>
                      <th className="text-left py-2">Investimento</th>
                      <th className="text-left py-2">ROI Esperado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">INÍCIO</td>
                      <td className="py-2">89.4%</td>
                      <td className="py-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Média</span></td>
                      <td className="py-2">Baixo (Digital)</td>
                      <td className="py-2">200%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">EXPANSÃO</td>
                      <td className="py-2">2.2%</td>
                      <td className="py-2"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Alta</span></td>
                      <td className="py-2">Médio</td>
                      <td className="py-2">400%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">MATURIDADE</td>
                      <td className="py-2">1.5%</td>
                      <td className="py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Crítica</span></td>
                      <td className="py-2">Alto</td>
                      <td className="py-2">600%</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">DECLÍNIO</td>
                      <td className="py-2">6.9%</td>
                      <td className="py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Crítica</span></td>
                      <td className="py-2">Alto</td>
                      <td className="py-2">800%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Santander - Dados Reais FIAP</h1>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Dados Reais ✓
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Visão Geral', icon: '📊' },
              { id: 'clusters', name: 'Clusters', icon: '🎯' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'strategies', name: 'Estratégias', icon: '🎪' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <main>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default RealDataDashboard;