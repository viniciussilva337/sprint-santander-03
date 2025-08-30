import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const useExport = () => {
  // Export para PDF
  const exportToPDF = useCallback(async (selectedMonth, currentData, monthOptions) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Configurações
      const margin = 20;
      const lineHeight = 7;
      let yPos = margin;

      // Função para adicionar nova página se necessário
      const checkPageBreak = (requiredSpace = 20) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dashboard Santander - Relatório Executivo', margin, yPos);
      yPos += 15;

      // Data e período
      const selectedMonthName = monthOptions.find(m => m.value === selectedMonth)?.label || 'Período selecionado';
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Período: ${selectedMonthName}`, margin, yPos);
      yPos += 10;
      pdf.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos);
      yPos += 15;

      // Resumo Executivo
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resumo Executivo', margin, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const resumo = [
        `• Total de empresas analisadas: ${currentData?.stats?.total_empresas?.toLocaleString()}`,
        `• Total de transações: ${currentData?.stats?.total_transacoes?.toLocaleString()}`,
        `• Volume transacional: R$ ${(currentData?.stats?.volume_total / 1000000).toFixed(1)}M`,
        `• Qualidade do clustering (Silhouette): ${currentData?.stats?.silhouette_score}`,
        `• Ticket médio: R$ ${currentData?.stats?.ticket_medio?.toLocaleString()}`
      ];

      resumo.forEach(item => {
        pdf.text(item, margin, yPos);
        yPos += lineHeight;
      });
      yPos += 10;

      // Análise dos Clusters
      checkPageBreak(40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Análise dos Clusters', margin, yPos);
      yPos += 10;

      currentData?.clusters?.forEach((cluster, index) => {
        checkPageBreak(25);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${cluster.name} (${cluster.percentage}% da base)`, margin, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const clusterInfo = [
          `  - Empresas: ${cluster.count.toLocaleString()}`,
          `  - Faturamento médio: R$ ${(cluster.faturamento_medio / 1000000).toFixed(1)}M`,
          `  - Saldo médio: R$ ${(cluster.saldo_medio / 1000).toFixed(0)}k`,
          `  - Transações médias: ${cluster.transacoes_medio.toFixed(1)}/mês`
        ];

        clusterInfo.forEach(info => {
          pdf.text(info, margin, yPos);
          yPos += lineHeight;
        });
        yPos += 5;
      });

      // Insights e Recomendações
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Insights e Recomendações', margin, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const insights = [
        '• Cluster Início representa a maior oportunidade de volume (>80% da base)',
        '• Empresas em Expansão mostram alta atividade transacional',
        '• Cluster Maturidade tem potencial para produtos premium',
        '• Cluster Declínio necessita estratégias de reativação direcionadas',
        '• Score de qualidade indica excelente segmentação dos clusters'
      ];

      insights.forEach(insight => {
        checkPageBreak(15);
        pdf.text(insight, margin, yPos);
        yPos += lineHeight;
      });

      // Rodapé
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      const footerText = 'Relatório gerado automaticamente pelo Dashboard Santander - Challenge FIAP';
      pdf.text(footerText, margin, pageHeight - 10);

      // Salvar PDF
      const fileName = `Dashboard_Santander_${selectedMonthName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      return { success: true, fileName };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Export para Excel
  const exportToExcel = useCallback(async (selectedMonth, currentData, monthOptions, dadosPorMes) => {
    try {
      const workbook = XLSX.utils.book_new();

      // Aba 1: Resumo do Período
      const selectedMonthName = monthOptions.find(m => m.value === selectedMonth)?.label || 'Período selecionado';
      
      const resumoData = [
        ['Dashboard Santander - Análise por Período'],
        [''],
        ['Período Selecionado:', selectedMonthName],
        ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
        [''],
        ['MÉTRICAS GERAIS'],
        ['Total de Empresas:', currentData?.stats?.total_empresas],
        ['Total de Transações:', currentData?.stats?.total_transacoes],
        ['Volume Total (R$):', currentData?.stats?.volume_total],
        ['Ticket Médio (R$):', currentData?.stats?.ticket_medio],
        ['Faturamento Médio Geral (R$):', currentData?.stats?.faturamento_medio_geral],
        ['Saldo Médio Geral (R$):', currentData?.stats?.saldo_medio_geral],
        ['Score Silhouette:', currentData?.stats?.silhouette_score],
        ['']
      ];

      const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(workbook, wsResumo, 'Resumo');

      // Aba 2: Detalhes dos Clusters
      const clustersData = [
        ['ANÁLISE DETALHADA DOS CLUSTERS'],
        [''],
        ['Cluster', 'Empresas', 'Percentual', 'Faturamento Médio (R$)', 'Saldo Médio (R$)', 'Transações Médias', 'Entrada Média (R$)', 'Saída Média (R$)']
      ];

      currentData?.clusters?.forEach(cluster => {
        clustersData.push([
          cluster.name,
          cluster.count,
          `${cluster.percentage}%`,
          cluster.faturamento_medio,
          cluster.saldo_medio,
          cluster.transacoes_medio,
          cluster.entrada_media,
          cluster.saida_media
        ]);
      });

      const wsClusters = XLSX.utils.aoa_to_sheet(clustersData);
      XLSX.utils.book_append_sheet(workbook, wsClusters, 'Clusters');

      // Aba 3: Comparativo Mensal (se houver dados de outros meses)
      if (Object.keys(dadosPorMes).length > 1) {
        const comparativoData = [
          ['COMPARATIVO MENSAL'],
          [''],
          ['Período', 'Empresas', 'Transações', 'Volume (R$)', 'Ticket Médio (R$)', 'Score Silhouette']
        ];

        Object.entries(dadosPorMes).forEach(([mes, dados]) => {
          const mesNome = monthOptions.find(m => m.value === mes)?.label || mes;
          comparativoData.push([
            mesNome,
            dados.stats?.total_empresas || 0,
            dados.stats?.total_transacoes || 0,
            dados.stats?.volume_total || 0,
            dados.stats?.ticket_medio || 0,
            dados.stats?.silhouette_score || 0
          ]);
        });

        const wsComparativo = XLSX.utils.aoa_to_sheet(comparativoData);
        XLSX.utils.book_append_sheet(workbook, wsComparativo, 'Comparativo');
      }

      // Aba 4: Estratégias Recomendadas
      const estrategiasData = [
        ['ESTRATÉGIAS RECOMENDADAS POR CLUSTER'],
        [''],
        ['Cluster', 'Percentual da Base', 'Produtos Sugeridos', 'Abordagem', 'Canal', 'ROI Projetado']
      ];

      const estrategiasPorCluster = {
        'INÍCIO': {
          produtos: 'Conta PJ Digital, PIX Empresarial',
          abordagem: 'Educacional, Onboarding Simplificado',
          canal: '100% Digital + Suporte Chat',
          roi: 'R$ 8,000/empresa'
        },
        'EXPANSÃO': {
          produtos: 'Capital de Giro, Antecipação de Recebíveis',
          abordagem: 'Comercial Proativa, Crédito Pré-aprovado',
          canal: 'Gerente de Conta + Digital',
          roi: 'R$ 45,000/empresa'
        },
        'MATURIDADE': {
          produtos: 'Cash Management, Investimentos, Seguros',
          abordagem: 'Consultiva Premium, Soluções Corporativas',
          canal: 'Private Banking + Assessoria',
          roi: 'R$ 95,000/empresa'
        },
        'DECLÍNIO': {
          produtos: 'Migração de Conta, Concentração Bancária',
          abordagem: 'Reativação, Campanhas Especiais',
          canal: 'Gerente Sênior + Ofertas Dirigidas',
          roi: 'R$ 180,000/empresa'
        }
      };

      currentData?.clusters?.forEach(cluster => {
        const estrategia = estrategiasPorCluster[cluster.name];
        if (estrategia) {
          estrategiasData.push([
            cluster.name,
            `${cluster.percentage}%`,
            estrategia.produtos,
            estrategia.abordagem,
            estrategia.canal,
            estrategia.roi
          ]);
        }
      });

      const wsEstrategias = XLSX.utils.aoa_to_sheet(estrategiasData);
      XLSX.utils.book_append_sheet(workbook, wsEstrategias, 'Estratégias');

      // Salvar Excel
      const fileName = `Dashboard_Santander_${selectedMonthName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, fileName);

      return { success: true, fileName };
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Export de screenshot do dashboard (PDF visual)
  const exportScreenshotPDF = useCallback(async (selectedMonth, monthOptions) => {
    try {
      const element = document.getElementById('dashboard-container');
      if (!element) {
        throw new Error('Container do dashboard não encontrado');
      }

      // Capturar screenshot
      const canvas = await html2canvas(element, {
        height: element.scrollHeight,
        width: element.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        scale: 0.8
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20; // margem de 10mm de cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10; // margem superior

      // Adicionar imagem (com paginação se necessário)
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      // Salvar
      const selectedMonthName = monthOptions.find(m => m.value === selectedMonth)?.label || 'Dashboard';
      const fileName = `Dashboard_Screenshot_${selectedMonthName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      return { success: true, fileName };
    } catch (error) {
      console.error('Erro ao gerar screenshot PDF:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    exportToPDF,
    exportToExcel,
    exportScreenshotPDF
  };
};