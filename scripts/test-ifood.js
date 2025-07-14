#!/usr/bin/env node

/**
 * Script de Teste Automatizado da API iFood
 * 
 * Este script demonstra como usar a API do iFood programaticamente
 * e pode ser usado para testes automatizados ou CI/CD.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simular as funções do ifoodService para demonstração
class IFoodTestRunner {
  constructor() {
    this.testResults = [];
    this.isConfigured = false;
  }

  // Simular verificação de configuração
  checkConfiguration() {
    const apiKey = process.env.VITE_IFOOD_API_KEY;
    const merchantId = process.env.VITE_IFOOD_MERCHANT_ID;
    
    this.isConfigured = !!(apiKey && merchantId);
    
    this.addTestResult(
      'Verificar Configuração',
      this.isConfigured ? 'success' : 'info',
      this.isConfigured ? 'iFood configurado corretamente' : 'iFood não configurado - usando simulação',
      { configured: this.isConfigured, hasApiKey: !!apiKey, hasMerchantId: !!merchantId }
    );
    
    return this.isConfigured;
  }

  // Simular pedido de teste
  createTestOrder() {
    return {
      id: `test_${Date.now()}`,
      customer: {
        name: 'João Silva',
        email: 'joao@teste.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        zipCode: '01234-567',
        complement: 'Apto 45'
      },
      items: [
        {
          id: 'burger_1',
          name: 'X-Burger',
          price: 25.90,
          quantity: 2,
          image: '/images/burger.jpg',
          description: 'Hambúrguer com queijo'
        },
        {
          id: 'fries_1',
          name: 'Batata Frita',
          price: 12.90,
          quantity: 1,
          image: '/images/fries.jpg',
          description: 'Porção de batatas fritas'
        }
      ],
      total: 64.70,
      finalTotal: 64.70,
      deliveryFee: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Simular solicitação de entrega
  async simulateDeliveryRequest(order) {
    this.addTestResult('Solicitar Entrega', 'info', `Iniciando solicitação para pedido #${order.id}`, { orderId: order.id });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const deliveryResponse = {
      deliveryId: `ifood_${order.id}_${Date.now()}`,
      status: 'accepted',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutos
      deliveryPartner: {
        name: 'Carlos Santos',
        phone: '(11) 88888-8888',
        vehicle: 'Moto'
      },
      trackingUrl: `https://tracking.ifood.com.br/delivery/${order.id}`
    };
    
    this.addTestResult(
      'Solicitar Entrega',
      'success',
      `Entrega solicitada com sucesso! ID: ${deliveryResponse.deliveryId}`,
      deliveryResponse
    );
    
    return deliveryResponse;
  }

  // Simular busca de status
  async simulateStatusCheck(deliveryId) {
    this.addTestResult('Buscar Status', 'info', `Buscando status para entrega ${deliveryId}`, { deliveryId });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const statuses = ['preparing', 'ready', 'picked_up', 'delivering', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const deliveryStatus = {
      deliveryId,
      status: randomStatus,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      currentLocation: randomStatus === 'delivering' ? {
        latitude: -23.5505,
        longitude: -46.6333
      } : undefined,
      deliveryPartner: {
        name: 'Carlos Santos',
        phone: '(11) 88888-8888',
        vehicle: 'Moto'
      },
      updatedAt: new Date()
    };
    
    this.addTestResult(
      'Buscar Status',
      'success',
      `Status atualizado: ${deliveryStatus.status}`,
      deliveryStatus
    );
    
    return deliveryStatus;
  }

  // Simular cancelamento de entrega
  async simulateDeliveryCancel(deliveryId, reason = 'Teste automatizado') {
    this.addTestResult('Cancelar Entrega', 'info', `Cancelando entrega ${deliveryId}`, { deliveryId, reason });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = Math.random() > 0.1; // 90% de sucesso
    
    if (success) {
      this.addTestResult(
        'Cancelar Entrega',
        'success',
        `Entrega cancelada com sucesso`,
        { deliveryId, success, reason }
      );
    } else {
      this.addTestResult(
        'Cancelar Entrega',
        'error',
        `Falha ao cancelar entrega`,
        { deliveryId, success, reason }
      );
    }
    
    return success;
  }

  // Executar todos os testes
  async runAllTests() {
    console.log('🚀 Iniciando testes da API iFood...\n');
    
    // Teste 1: Verificar configuração
    this.checkConfiguration();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 2: Criar pedido de teste
    const testOrder = this.createTestOrder();
    this.addTestResult('Criar Pedido de Teste', 'success', `Pedido criado: #${testOrder.id}`, testOrder);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 3: Solicitar entrega
    const deliveryResponse = await this.simulateDeliveryRequest(testOrder);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Teste 4: Buscar status
    const deliveryStatus = await this.simulateStatusCheck(deliveryResponse.deliveryId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Teste 5: Simular múltiplas atualizações de status
    for (let i = 0; i < 3; i++) {
      await this.simulateStatusCheck(deliveryResponse.deliveryId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Teste 6: Cancelar entrega
    await this.simulateDeliveryCancel(deliveryResponse.deliveryId);
    
    // Teste 7: Teste de erro (simular falha)
    this.addTestResult(
      'Teste de Erro',
      'error',
      'Simulando erro de rede',
      { error: 'Connection timeout', retry: true }
    );
    
    console.log('\n✅ Todos os testes concluídos!');
    this.printResults();
    this.exportResults();
  }

  // Adicionar resultado de teste
  addTestResult(test, status, message, data = null) {
    const result = {
      id: Date.now() + Math.random(),
      test,
      status,
      message,
      data,
      timestamp: new Date()
    };
    
    this.testResults.push(result);
    
    // Log em tempo real
    const statusIcon = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    console.log(`${statusIcon[status]} ${test}: ${message}`);
  }

  // Imprimir resultados
  printResults() {
    console.log('\n📊 RESUMO DOS TESTES');
    console.log('='.repeat(50));
    
    const summary = {
      total: this.testResults.length,
      success: this.testResults.filter(r => r.status === 'success').length,
      error: this.testResults.filter(r => r.status === 'error').length,
      info: this.testResults.filter(r => r.status === 'info').length
    };
    
    console.log(`Total de testes: ${summary.total}`);
    console.log(`✅ Sucessos: ${summary.success}`);
    console.log(`❌ Erros: ${summary.error}`);
    console.log(`ℹ️ Informações: ${summary.info}`);
    console.log(`📈 Taxa de sucesso: ${((summary.success / summary.total) * 100).toFixed(1)}%`);
    
    if (summary.error > 0) {
      console.log('\n❌ TESTES COM ERRO:');
      this.testResults
        .filter(r => r.status === 'error')
        .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
    }
  }

  // Exportar resultados
  exportResults() {
    const results = {
      timestamp: new Date().toISOString(),
      configuration: { isConfigured: this.isConfigured },
      testResults: this.testResults,
      summary: {
        total: this.testResults.length,
        success: this.testResults.filter(r => r.status === 'success').length,
        error: this.testResults.filter(r => r.status === 'error').length,
        info: this.testResults.filter(r => r.status === 'info').length
      }
    };
    
    const outputPath = path.join(__dirname, '../test-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`\n📁 Resultados exportados para: ${outputPath}`);
  }
}

// Função principal
async function main() {
  const runner = new IFoodTestRunner();
  
  try {
    await runner.runAllTests();
  } catch (error) {
    console.error('❌ Erro durante a execução dos testes:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default IFoodTestRunner; 