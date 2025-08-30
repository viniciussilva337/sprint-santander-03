import React, { useState } from 'react';
import RealDataDashboard from './RealDataDashboard.jsx';
import FilteredDashboard from './FilteredDashboard.jsx';

const App = () => {
  const [dashboardType, setDashboardType] = useState('filtered'); // filtered, real, mock

  if (dashboardType === 'filtered') {
    return <FilteredDashboard />;
  } else if (dashboardType === 'real') {
    return <RealDataDashboard />;
  }

  return <SantanderDashboard />;
};

const SantanderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { name: 'Total Receita', score: 0.185, percentage: 100 },
    { name: 'Liquidez', score: 0.171, percentage: 92 },
    { name: 'Maturidade Score', score: 0.158, percentage: 85 },
    { name: 'Risco Score', score: 0.145, percentage: 78 },
    { name: 'Qtd Transações', score: 0.132, percentage: 71 },
    { name: 'Saldo Líquido', score: 0.119, percentage: 64 },
    { name: 'Atividade', score: 0.106, percentage: 57 },
    { name: 'Estabilidade', score: 0.093, percentage: 50 },
    { name: 'Crescimento Score', score: 0.080, percentage: 43 },
    { name: 'Ticket Médio', score: 0.067, percentage: 36 }
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
                {item.value > 1000 ? `${(item.value/1000).toFixed(0)}k` : item.value}
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
                <div className="text-2xl font-bold text-red-600">{total}</div>
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
              <span>{item.name}: {item.value}</span>
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

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">200</div>
                <div className="text-gray-600 font-medium">Empresas Analisadas</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">4</div>
                <div className="text-gray-600 font-medium">Momentos de Vida</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">0.742</div>
                <div className="text-gray-600 font-medium">Qualidade (Silhouette)</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-bold text-red-600 mb-2">20+</div>
                <div className="text-gray-600 font-medium">Features Analisadas</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl">
                <SimplePieChart 
                  data={[
                    {name: 'Início', value: 50, color: '#EC0000'},
                    {name: 'Expansão', value: 70, color: '#FF4D4D'},
                    {name: 'Maturidade', value: 60, color: '#FF8080'},
                    {name: 'Declínio', value: 20, color: '#FFB3B3'}
                  ]}
                  title="Distribuição por Momento de Vida"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleBarChart 
                  data={[
                    {name: 'Início', value: 12500},
                    {name: 'Expansão', value: 37800},
                    {name: 'Maturidade', value: 95200},
                    {name: 'Declínio', value: 18700}
                  ]}
                  title="Receita Média por Cluster (R$)"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleLineChart 
                  data={[
                    {name: 'K=2', value: 0.421},
                    {name: 'K=3', value: 0.589},
                    {name: 'K=4', value: 0.742},
                    {name: 'K=5', value: 0.698},
                    {name: 'K=6', value: 0.634}
                  ]}
                  title="Evolução da Qualidade do Modelo"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Status do Sistema</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-bold text-green-800">Sistema Operacional</div>
                    <div className="text-sm text-green-700 mt-2">
                      Última atualização: Agosto 2025<br/>
                      Modelo: K-Means Otimizado<br/>
                      Qualidade: <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">EXCELENTE</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Total de Transações:</strong> 12,450</div>
                    <div><strong>Período Analisado:</strong> 6 meses</div>
                    <div><strong>Tempo de Processamento:</strong> 4.2 min</div>
                    <div><strong>Acurácia Validação:</strong> 87.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'clusters':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="text-xl font-bold mb-4">INÍCIO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Empresas:</span><span>50 (25%)</span></div>
                  <div className="flex justify-between"><span>Receita Média:</span><span>R$ 12,500</span></div>
                  <div className="flex justify-between"><span>Transações:</span><span>7/mês</span></div>
                  <div className="flex justify-between"><span>Saldo Médio:</span><span>R$ 2,100</span></div>
                  <div className="flex justify-between"><span>Score Risco:</span><span>6.2/10</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="text-xl font-bold mb-4">EXPANSÃO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Empresas:</span><span>70 (35%)</span></div>
                  <div className="flex justify-between"><span>Receita Média:</span><span>R$ 37,800</span></div>
                  <div className="flex justify-between"><span>Transações:</span><span>17/mês</span></div>
                  <div className="flex justify-between"><span>Saldo Médio:</span><span>R$ 8,200</span></div>
                  <div className="flex justify-between"><span>Score Risco:</span><span>4.1/10</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-300 to-red-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="text-xl font-bold mb-4">MATURIDADE</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Empresas:</span><span>60 (30%)</span></div>
                  <div className="flex justify-between"><span>Receita Média:</span><span>R$ 95,200</span></div>
                  <div className="flex justify-between"><span>Transações:</span><span>26/mês</span></div>
                  <div className="flex justify-between"><span>Saldo Médio:</span><span>R$ 18,500</span></div>
                  <div className="flex justify-between"><span>Score Risco:</span><span>2.3/10</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-200 to-red-400 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h4 className="text-xl font-bold mb-4">DECLÍNIO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Empresas:</span><span>20 (10%)</span></div>
                  <div className="flex justify-between"><span>Receita Média:</span><span>R$ 18,700</span></div>
                  <div className="flex justify-between"><span>Transações:</span><span>5/mês</span></div>
                  <div className="flex justify-between"><span>Saldo Médio:</span><span>-R$ 3,200</span></div>
                  <div className="flex justify-between"><span>Score Risco:</span><span>8.7/10</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl">
                <SimpleBarChart 
                  data={[
                    {name: 'Início', value: 0.168},
                    {name: 'Expansão', value: 0.217},
                    {name: 'Maturidade', value: 0.194},
                    {name: 'Declínio', value: -0.171}
                  ]}
                  title="Liquidez por Cluster"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Matriz de Risco x Maturidade</h3>
                <div className="h-80 relative">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <circle cx="20%" cy="80%" r="8" fill="#EC0000" />
                    <circle cx="35%" cy="65%" r="8" fill="#FF4D4D" />
                    <circle cx="80%" cy="25%" r="8" fill="#FF8080" />
                    <circle cx="15%" cy="90%" r="8" fill="#FFB3B3" />
                    
                    <text x="20%" y="95%" textAnchor="middle" className="text-xs fill-gray-600">Início</text>
                    <text x="35%" y="75%" textAnchor="middle" className="text-xs fill-gray-600">Expansão</text>
                    <text x="80%" y="35%" textAnchor="middle" className="text-xs fill-gray-600">Maturidade</text>
                    <text x="15%" y="100%" textAnchor="middle" className="text-xs fill-gray-600">Declínio</text>
                  </svg>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
                    Score Maturidade
                  </div>
                  <div className="absolute top-1/2 left-2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-600">
                    Score Risco
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Top 10 Features Mais Importantes</h3>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Métricas de Qualidade</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">K-Means</span>
                      <span className="text-red-600 font-bold">0.891</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Silhouette: 0.742</div>
                      <div>Calinski-Harabasz: 1,247.3</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Agglomerative</span>
                      <span className="text-red-600 font-bold">0.826</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Silhouette: 0.698</div>
                      <div>Calinski-Harabasz: 1,089.7</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Gaussian Mixture</span>
                      <span className="text-red-600 font-bold">0.754</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Silhouette: 0.645</div>
                      <div>Calinski-Harabasz: 923.1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia INÍCIO</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Conta PJ Básica, PIX Empresarial, Cartão de Crédito</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Educacional e de Relacionamento</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Digital + Suporte Telefônico</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">300% (R$ 40,000)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia EXPANSÃO</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Capital de Giro, Antecipação de Recebíveis</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Comercial Proativa</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Gerente de Conta + Digital</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">300% (R$ 175,000)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia MATURIDADE</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Investimentos, Seguros Empresariais</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Consultiva e de Alto Valor</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Private Banking + Assessoria</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">200% (R$ 120,000)</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-600">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Estratégia DECLÍNIO</h4>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Produtos:</span> <span className="text-gray-600">Renegociação de Dívidas, Consultoria</span></div>
                  <div><span className="font-semibold text-gray-700">Abordagem:</span> <span className="text-gray-600">Suporte e Recuperação</span></div>
                  <div><span className="font-semibold text-gray-700">Canal:</span> <span className="text-gray-600">Especialista em Reestruturação</span></div>
                  <div><span className="font-semibold text-gray-700">ROI Projetado:</span> <span className="text-red-600 font-bold">150% (R$ 25,000)</span></div>
                </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Santander</h1>
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

export default App;