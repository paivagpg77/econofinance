import Decimal from 'decimal.js';
import { Company } from '../../companies/company.entity';
import { TaxRule } from '../tax-rule.entity';

export interface ApuracaoInput {
  company: Company;
  faturamentoMensal: Decimal;
  rules: TaxRule[];
}

export interface ImpostoCalculado {
  tipoImposto: string;
  aliquotaAplicada: Decimal;
  valor: Decimal;
}

/**
 * Cada regime tributário implementa sua própria lógica de apuração.
 * Isso é o que permite adicionar um novo regime sem tocar nos outros.
 */
export interface TaxStrategy {
  calcular(input: ApuracaoInput): ImpostoCalculado[];
}
