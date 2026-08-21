import { Injectable } from '@nestjs/common';
import { ApuracaoInput, ImpostoCalculado, TaxStrategy } from './tax-strategy.interface';

/**
 * Lucro Real: apurado sobre o LUCRO contábil real (receitas - despesas),
 * não sobre o faturamento bruto como nos outros regimes.
 * TODO: depende do módulo financeiro (transactions) estar pronto para
 * calcular o lucro líquido do período antes de aplicar IRPJ/CSLL.
 * Deixado como placeholder até o módulo de transações financeiras existir.
 */
@Injectable()
export class LucroRealStrategy implements TaxStrategy {
  calcular(_input: ApuracaoInput): ImpostoCalculado[] {
    throw new Error(
      'Apuração do Lucro Real ainda não implementada — depende do módulo financeiro (lucro líquido do período)',
    );
  }
}
