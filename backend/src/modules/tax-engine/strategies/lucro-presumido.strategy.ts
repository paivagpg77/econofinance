import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { ApuracaoInput, ImpostoCalculado, TaxStrategy } from './tax-strategy.interface';

/**
 * Lucro Presumido: diferente do Simples, cada imposto (IRPJ, CSLL, PIS,
 * COFINS, ICMS/ISS) é apurado separadamente com sua própria alíquota.
 */
@Injectable()
export class LucroPresumidoStrategy implements TaxStrategy {
  calcular({ faturamentoMensal, rules }: ApuracaoInput): ImpostoCalculado[] {
    return rules.map((rule) => {
      const aliquota = new Decimal(rule.aliquota);
      return {
        tipoImposto: rule.tipoImposto,
        aliquotaAplicada: aliquota,
        valor: faturamentoMensal.times(aliquota),
      };
    });
  }
}
