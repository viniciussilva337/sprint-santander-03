import React, { useState, useEffect } from 'react';
import ExportButtons from './components/ExportButtons.jsx';
import NetworkAnalysis from './NetworkAnalysis.jsx';
import dadosPorMesJSON from '../dados_por_mes.json';

const FilteredDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [dadosPorMes, setDadosPorMes] = useState(dadosPorMesJSON);
  const [currentData, setCurrentData] = useState(dadosPorMesJSON['todos']);

  const monthOptions = [
    { value: 'todos', label: 'Todos os Meses', icon: '📅' },
    { value: '2025-01', label: 'Janeiro 2025', icon: '🗓️' },
    { value: '2025-02', label: 'Fevereiro 2025', icon: '🗓️' },
    { value: '2025-03', label: 'Março 2025', icon: '🗓️' },
    { value: '2025-04', label: 'Abril 2025', icon: '🗓️' },
    { value: '2025-05', label: 'Maio 2025', icon: '🗓️' }
  ];

  useEffect(() => {
    setCurrentData(dadosPorMes[selectedMonth]);
  }, [selectedMonth, dadosPorMes]);

  const features = [
    { name: 'Faturamento Total', score: 0.385, percentage: 100 },
    { name: 'Saldo Conta Corrente', score: 0.248, percentage: 64 },
    { name: 'Volume Transacional', score: 0.187, percentage: 49 },
    { name: 'Setor CNAE', score: 0.156, percentage: 41 },
    { name: 'Atividade Mensal', score: 0.124, percentage: 32 },
    { name: 'Liquidez Operacional', score: 0.098, percentage: 25 },
    { name: 'Ticket Médio', score: 0.076, percentage: 20 },
    { name: 'Sazonalidade', score: 0.062, percentage: 16 },
    { name: 'Tempo de Conta', score: 0.048, percentage: 12 },
    { name: 'Região Geográfica', score: 0.035, percentage: 9 }
  ];

  const SimpleBarChart = ({ data, title }) => {
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
              if (item.value === 0) return null;
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
          {data.filter(item => item.value > 0).map((item, index) => (
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

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000000) {
      return `R$ ${(value / 1000000000).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1000000) {
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
              <h3 className="text-lg font-bold text-blue-800 mb-2">📊 Dashboard com Filtros Temporais - Challenge FIAP</h3>
              <p className="text-sm text-blue-700">
                Análise dinâmica por período. Dados reais de <strong>{currentData?.stats?.total_empresas?.toLocaleString()} empresas</strong> e <strong>{currentData?.stats?.total_transacoes?.toLocaleString()} transações</strong>.
                Silhouette Score: <strong>{currentData?.stats?.silhouette_score}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">{(currentData?.stats?.total_empresas / 1000).toFixed(0)}k</div>
                <div className="text-gray-600 font-medium">Empresas</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">{(currentData?.stats?.total_transacoes / 1000).toFixed(0)}k</div>
                <div className="text-gray-600 font-medium">Transações</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">{currentData?.stats?.silhouette_score}</div>
                <div className="text-gray-600 font-medium">Qualidade (Silhouette)</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">{formatCurrency(currentData?.stats?.volume_total || 0).replace('R$ ', '')}</div>
                <div className="text-gray-600 font-medium">Volume Total</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl">
                <SimplePieChart 
                  data={currentData?.clusters?.map((cluster, i) => ({
                    name: cluster.name,
                    value: cluster.count,
                    color: ['#EC0000', '#FF4D4D', '#FF8080', '#FFB3B3'][i]
                  })) || []}
                  title="Distribuição por Momento de Vida"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleBarChart 
                  data={currentData?.clusters?.map(cluster => ({
                    name: cluster.name.substring(0, 3),
                    value: cluster.faturamento_medio
                  })) || []}
                  title="Faturamento Médio por Cluster (R$)"
                />
              </div>
            </div>

            {/* Comparativo mensal */}
            {selectedMonth !== 'todos' && (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Comparativo com Todos os Meses</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{monthOptions.find(m => m.value === selectedMonth)?.label}</div>
                    <div className="text-sm text-gray-600">Empresas: {currentData?.stats?.total_empresas?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Transações: {currentData?.stats?.total_transacoes?.toLocaleString()}</div>
                    <div className="text-sm text-red-600 font-bold">Score: {currentData?.stats?.silhouette_score}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">Todos os Meses</div>
                    <div className="text-sm text-gray-600">Empresas: {dadosPorMes.todos?.stats?.total_empresas?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Transações: {dadosPorMes.todos?.stats?.total_transacoes?.toLocaleString()}</div>
                    <div className="text-sm text-blue-600 font-bold">Score: {dadosPorMes.todos?.stats?.silhouette_score}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'clusters':
        return (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-800">
                ✅ Clusters para {monthOptions.find(m => m.value === selectedMonth)?.label}
              </h3>
              <p className="text-sm text-green-700">
                Análise de {currentData?.stats?.total_empresas?.toLocaleString()} empresas 
                {currentData?.stats?.total_transacoes > 0 && ` e ${currentData?.stats?.total_transacoes?.toLocaleString()} transações`}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentData?.clusters?.map((cluster, index) => {
                const colors = ['from-red-500 to-red-700', 'from-red-400 to-red-600', 'from-red-300 to-red-500', 'from-red-200 to-red-400'];
                return (
                  <div key={cluster.id} className={`bg-gradient-to-br ${colors[index]} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                    <h4 className="text-xl font-bold mb-4">{cluster.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Empresas:</span><span>{cluster.count} ({cluster.percentage}%)</span></div>
                      <div className="flex justify-between"><span>Faturamento:</span><span>{formatCurrency(cluster.faturamento_medio)}</span></div>
                      <div className="flex justify-between"><span>Transações:</span><span>{cluster.transacoes_medio}/mês</span></div>
                      <div className="flex justify-between"><span>Saldo Médio:</span><span>{formatCurrency(cluster.saldo_medio)}</span></div>
                      {cluster.entrada_media > 0 && (
                        <>
                          <div className="flex justify-between"><span>Entrada:</span><span>{formatCurrency(cluster.entrada_media)}</span></div>
                          <div className="flex justify-between"><span>Saída:</span><span>{formatCurrency(cluster.saida_media)}</span></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Análise por transações */}
            {currentData?.stats?.total_transacoes > 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Análise Transacional</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(currentData.stats.volume_total)}</div>
                    <div className="text-sm text-gray-600">Volume Total Transacionado</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentData.stats.ticket_medio)}</div>
                    <div className="text-sm text-gray-600">Ticket Médio</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(currentData.stats.total_transacoes / currentData.stats.total_empresas).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Transações por empresa</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-800">⚠️ Sem Dados Transacionais</h3>
                <p className="text-sm text-yellow-700">
                  {monthOptions.find(m => m.value === selectedMonth)?.label} não possui dados de transações na base.
                  As transações estão disponíveis apenas para Março, Abril e Maio de 2025.
                </p>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Features Mais Importantes</h3>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Qualidade - {monthOptions.find(m => m.value === selectedMonth)?.label}
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">K-Means (Score)</span>
                      <span className="text-red-600 font-bold">{currentData?.stats?.silhouette_score}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Qualidade: {currentData?.stats?.silhouette_score >= 0.8 ? 'Excelente' : currentData?.stats?.silhouette_score >= 0.7 ? 'Muito Boa' : 'Boa'}</div>
                      <div>Empresas: {currentData?.stats?.total_empresas?.toLocaleString()}</div>
                      <div>Transações: {currentData?.stats?.total_transacoes?.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-bold text-green-800">Análise da Qualidade</div>
                    <div className="text-sm text-green-700 mt-2">
                      {currentData?.stats?.silhouette_score >= 0.8 ? 
                        'Score excelente indica clusters muito bem definidos e separados.' :
                        'Score indica boa separação entre os clusters identificados.'
                      }
                      <br/>
                      {currentData?.stats?.total_transacoes === 0 ? 
                        'Análise baseada apenas em dados cadastrais (faturamento, saldo).' :
                        'Análise enriquecida com dados transacionais em tempo real.'
                      }
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div><strong>Período:</strong> {monthOptions.find(m => m.value === selectedMonth)?.label}</div>
                    <div><strong>Algoritmo:</strong> K-Means (K=4)</div>
                    <div><strong>Features:</strong> {currentData?.stats?.total_transacoes > 0 ? '10 variáveis otimizadas' : '10 variáveis principais'}</div>
                    <div><strong>Validação:</strong> Silhouette Score</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Seção dedicada para Export */}
            <div className="grid grid-cols-1 gap-6">
              <ExportButtons 
                selectedMonth={selectedMonth}
                currentData={currentData}
                monthOptions={monthOptions}
                dadosPorMes={dadosPorMes}
              />
            </div>

            {/* Comparativo de qualidade por mês */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Qualidade do Modelo por Período</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {monthOptions.map(month => {
                  const data = dadosPorMes[month.value];
                  const isSelected = selectedMonth === month.value;
                  return (
                    <div key={month.value} className={`p-3 rounded-lg text-center ${isSelected ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'}`}>
                      <div className="text-xs text-gray-600 mb-1">{month.icon}</div>
                      <div className="text-sm font-bold">{month.label.split(' ')[0]}</div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-red-600' : 'text-gray-800'}`}>
                        {data?.stats?.silhouette_score || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {data?.stats?.total_transacoes > 0 ? `${(data.stats.total_transacoes/1000).toFixed(0)}k trans` : 'Sem trans'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-800">
                🎯 Estratégias para {monthOptions.find(m => m.value === selectedMonth)?.label}
              </h3>
              <p className="text-sm text-purple-700">Recomendações baseadas no perfil dos clusters no período selecionado.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData?.clusters?.map((cluster, index) => (
                <div key={cluster.id} className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Estratégia {cluster.name} ({cluster.percentage}%)
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Perfil:</span> 
                      <span className="text-gray-600 ml-2">
                        {cluster.count} empresas, faturamento médio {formatCurrency(cluster.faturamento_medio)}
                      </span>
                    </div>
                    
                    {/* Estratégia específica baseada no cluster */}
                    {cluster.name === 'INÍCIO' && (
                      <>
                        <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Conta PJ Digital, PIX Empresarial</span></div>
                        <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Educacional, Onboarding Simplificado</span></div>
                        <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">100% Digital + Suporte Chat</span></div>
                        <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">25% (R$ 1.200/empresa)</span></div>
                      </>
                    )}
                    
                    {cluster.name === 'EXPANSÃO' && (
                      <>
                        <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Capital de Giro, Antecipação de Recebíveis</span></div>
                        <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Comercial Proativa, Crédito Pré-aprovado</span></div>
                        <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Gerente de Conta + Digital</span></div>
                        <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">45% (R$ 3.200/empresa)</span></div>
                      </>
                    )}
                    
                    {cluster.name === 'MATURIDADE' && (
                      <>
                        <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Cash Management, Investimentos, Seguros</span></div>
                        <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Consultiva Premium, Soluções Corporativas</span></div>
                        <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Private Banking + Assessoria</span></div>
                        <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">65% (R$ 8.500/empresa)</span></div>
                      </>
                    )}
                    
                    {cluster.name === 'DECLÍNIO' && (
                      <>
                        <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Migração de Conta, Concentração Bancária</span></div>
                        <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Reativação, Campanhas Especiais</span></div>
                        <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Gerente Sênior + Ofertas Dirigidas</span></div>
                        <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">35% (R$ 2.800/empresa)</span></div>
                      </>
                    )}

                    {/* Contexto temporal */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Contexto Temporal:</div>
                      <div className="text-xs text-gray-600">
                        {currentData?.stats?.total_transacoes === 0 ? 
                          'Período sem dados transacionais - foco em produtos básicos e onboarding.' :
                          `${(currentData?.stats?.total_transacoes / 1000).toFixed(0)}k transações no período - oportunidades para produtos transacionais.`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'networks':
        return <NetworkAnalysis />;
      default:
        return null;
    }
  };

  return (
    <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Santander - Filtros Temporais</h1>
            </div>
            
            {/* Filtro de Data */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Filtros Ativos ✓
              </div>
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
              { id: 'strategies', name: 'Estratégias', icon: '🎪' },
              { id: 'networks', name: 'Redes', icon: '🌐' }
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

export default FilteredDashboard;