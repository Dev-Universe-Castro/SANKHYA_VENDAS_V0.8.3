import { NextResponse } from 'next/server';
import { obterTokenAtual } from '@/lib/sankhya-api';

export async function GET() {
  try {
    console.log('🔍 [API /admin/token-info] Buscando informações do token...');

    const tokenInfo = await obterTokenAtual();

    console.log('📊 [API /admin/token-info] Token info:', tokenInfo ? 'Disponível' : 'Não disponível');

    if (!tokenInfo) {
      console.log('⚠️ [API /admin/token-info] Nenhum token disponível no cache');
      return NextResponse.json({
        ativo: false,
        mensagem: 'Nenhum token disponível. O token será gerado na próxima requisição.'
      });
    }

    console.log('✅ [API /admin/token-info] Retornando token info:', {
      ativo: tokenInfo.ativo,
      expiraEm: tokenInfo.expiraEm,
      geradoEm: tokenInfo.geradoEm
    });

    return NextResponse.json(tokenInfo);
  } catch (erro: any) {
    console.error('❌ [API /admin/token-info] Erro ao buscar token:', erro.message);
    return NextResponse.json({
      ativo: false,
      mensagem: `Erro: ${erro.message}`
    }, { status: 500 });
  }
}