import { NextResponse } from 'next/server';
import { redisCacheService } from '@/lib/redis-cache-service';

const API_LOGS_KEY = 'api_logs:sankhya';
const MAX_LOGS = 50;

export async function addApiLog(log: {
  method: string;
  url: string;
  status: number;
  duration: number;
  tokenUsed: boolean;
}) {
  const newLog = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString(),
    ...log
  };

  try {
    // Buscar logs existentes do Redis
    const existingLogs = await redisCacheService.get<any[]>(API_LOGS_KEY) || [];

    // Adicionar novo log no início
    existingLogs.unshift(newLog);

    // Manter apenas os últimos 50 logs
    const updatedLogs = existingLogs.slice(0, MAX_LOGS);

    // Salvar de volta no Redis (sem expiração - logs permanentes)
    await redisCacheService.set(API_LOGS_KEY, updatedLogs, 24 * 60 * 60 * 1000); // 24 horas

    console.log(`✅ Log adicionado: ${log.method} ${log.url} - ${log.status}`);
  } catch (error) {
    console.error('❌ Erro ao adicionar log:', error);
  }
}

export async function GET() {
  try {
    // Buscar logs do Redis
    const apiLogs = await redisCacheService.get<any[]>(API_LOGS_KEY) || [];

    return NextResponse.json({
      logs: apiLogs,
      total: apiLogs.length
    });
  } catch (error) {
    console.error('Erro ao obter logs:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';