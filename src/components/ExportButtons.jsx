import React, { useState } from 'react';
import { useExport } from '../hooks/useExport.js';

const ExportButtons = ({ selectedMonth, currentData, monthOptions, dadosPorMes }) => {
  const [isExporting, setIsExporting] = useState({ pdf: false, excel: false, screenshot: false });
  const [lastExport, setLastExport] = useState(null);
  const { exportToPDF, exportToExcel, exportScreenshotPDF } = useExport();

  const handleExport = async (type) => {
    setIsExporting(prev => ({ ...prev, [type]: true }));
    
    try {
      let result;
      switch (type) {
        case 'pdf':
          result = await exportToPDF(selectedMonth, currentData, monthOptions);
          break;
        case 'excel':
          result = await exportToExcel(selectedMonth, currentData, monthOptions, dadosPorMes);
          break;
        case 'screenshot':
          result = await exportScreenshotPDF(selectedMonth, monthOptions);
          break;
        default:
          throw new Error('Tipo de export inválido');
      }

      if (result.success) {
        setLastExport({
          type,
          fileName: result.fileName,
          timestamp: new Date().toLocaleString('pt-BR')
        });
      } else {
        alert(`Erro ao exportar: ${result.error}`);
      }
    } catch (error) {
      console.error(`Erro no export ${type}:`, error);
      alert(`Erro ao exportar: ${error.message}`);
    } finally {
      setIsExporting(prev => ({ ...prev, [type]: false }));
    }
  };

  const selectedMonthName = monthOptions.find(m => m.value === selectedMonth)?.label || 'Período atual';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Exportar & Compartilhar
      </h3>
      
      <div className="space-y-4">
        {/* Informações do período */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Período selecionado:</span>
            <span className="text-red-600 font-bold">{selectedMonthName}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-600">Empresas:</span>
            <span className="text-gray-800">{currentData?.stats?.total_empresas?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-600">Transações:</span>
            <span className="text-gray-800">{currentData?.stats?.total_transacoes?.toLocaleString()}</span>
          </div>
        </div>

        {/* Botões de Export */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* PDF Executivo */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting.pdf}
            className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="text-sm font-semibold text-red-700">
              {isExporting.pdf ? 'Gerando...' : 'PDF Executivo'}
            </div>
            <div className="text-xs text-gray-600 mt-1 text-center">
              Relatório com insights e recomendações
            </div>
          </button>

          {/* Excel Completo */}
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting.excel}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm font-semibold text-green-700">
              {isExporting.excel ? 'Gerando...' : 'Excel Completo'}
            </div>
            <div className="text-xs text-gray-600 mt-1 text-center">
              Dados completos para análise offline
            </div>
          </button>

          {/* Screenshot PDF */}
          <button
            onClick={() => handleExport('screenshot')}
            disabled={isExporting.screenshot}
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-2xl mb-2">📸</div>
            <div className="text-sm font-semibold text-blue-700">
              {isExporting.screenshot ? 'Capturando...' : 'Dashboard PDF'}
            </div>
            <div className="text-xs text-gray-600 mt-1 text-center">
              Screenshot do dashboard atual
            </div>
          </button>
        </div>

        {/* Último Export */}
        {lastExport && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✅</span>
              <div>
                <span className="font-medium text-green-800">
                  Export {lastExport.type.toUpperCase()} concluído
                </span>
                <div className="text-green-700 text-xs mt-1">
                  Arquivo: {lastExport.fileName}
                </div>
                <div className="text-green-600 text-xs">
                  {lastExport.timestamp}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informações sobre os exports */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Sobre os Exports:</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start">
              <span className="mr-2">📄</span>
              <div>
                <div className="font-medium">PDF Executivo:</div>
                <div>Resumo com insights, análise de clusters e recomendações estratégicas</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">📈</span>
              <div>
                <div className="font-medium">Excel Completo:</div>
                <div>Múltiplas abas com dados detalhados, comparativo mensal e estratégias</div>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">📸</span>
              <div>
                <div className="font-medium">Dashboard PDF:</div>
                <div>Captura visual completa do dashboard atual em PDF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Link de compartilhamento (futuro) */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compartilhamento:</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={`${window.location.origin}${window.location.pathname}?month=${selectedMonth}`}
              readOnly
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?month=${selectedMonth}`);
                alert('Link copiado para a área de transferência!');
              }}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              Copiar Link
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Link direto para este período específico do dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportButtons;