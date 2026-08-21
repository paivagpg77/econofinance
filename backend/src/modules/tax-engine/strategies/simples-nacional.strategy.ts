import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { ApuracaoInput, ImpostoCalculado, TaxStrategy } from './tax-strategy.interface';
import { TipoImposto } from '../tax-rule.entity';

/**
 * Simples Nacional: um único DAS calculado por faixa de faturamento (anexo).
 * Aqui simplificado — a regra real de "faixa com dedução" fica na tax_rules,
 * este service só aplica a alíquota já resolvida pra faixa correta.
 */
@Injectable()
export class SimplesNacionalStrategy implements TaxStrategy {
  calcular({ faturamentoMensal, rules }: ApuracaoInput): ImpostoCalculado[] {
    const regraDas = rules.find((r) => r.tipoImposto === TipoImposto.DAS);

    if (!regraDas) {
      throw new Error('Nenhuma regra de DAS encontrada para esta faixa de faturamento');
    }

    const aliquota = new Decimal(regraDas.aliquota);
    const valor = faturamentoMensal.times(aliquota);

    return [
      {
        tipoImposto: TipoImposto.DAS,
        aliquotaAplicada: aliquota,
        valor,
      },
    ];
  }
}
