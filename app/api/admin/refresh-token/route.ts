
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Importar dinamicamente para evitar problemas de cache
    const { obterToken } = await import('@/lib/sankhya-api');
    
    // Limpar cache e forçar novo token
    const token = await obterToken(true);
    
    return NextResponse.json({
      success: true,
      message: 'Token renovado com sucesso',
      token
    });
  } catch (error: any) {
    console.error('Erro ao renovar token:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao renovar token' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
