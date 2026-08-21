import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { TaxRule } from './tax-rule.entity';
import { Company, RegimeTributario } from '../companies/company.entity';
import { SimplesNacionalStrategy } from './strategies/simples-nacional.strategy';
import { LucroPresumidoStrategy } from './strategies/lucro-presumido.strategy';
import { LucroRealStrategy } from './strategies/lucro-real.strategy';
import { ImpostoCalculado, TaxStrategy } from './strategies/tax-strategy.interface';

@Injectable()
export class TaxEngineService {
  private readonly strategies: Record<RegimeTributario, TaxStrategy>;

  constructor(
    @InjectRepository(TaxRule)
    private readonly taxRulesRepo: Repository<TaxRule>,
    simplesNacional: SimplesNacionalStrategy,
    lucroPresumido: LucroPresumidoStrategy,
    lucroReal: LucroRealStrategy,
  ) {
    this.strategies = {
      [RegimeTributario.SIMPLES_NACIONAL]: simplesNacional,
      [RegimeTributario.LUCRO_PRESUMIDO]: lucroPresumido,
      [RegimeTributario.LUCRO_REAL]: lucroReal,
    };
  }

  async apurar(company: Company, faturamentoMensal: number): Promise<ImpostoCalculado[]> {
    const rules = await this.taxRulesRepo.find({
      where: {
        regimeTributario: company.regimeTributario,
        cnae: company.cnaePrincipal,
        uf: company.uf,
      },
    });

    if (rules.length === 0) {
      throw new Error(
        `Nenhuma regra fiscal cadastrada para regime=${company.regimeTributario}, cnae=${company.cnaePrincipal}, uf=${company.uf}`,
      );
    }

    const strategy = this.strategies[company.regimeTributario];
    return strategy.calcular({
      company,
      faturamentoMensal: new Decimal(faturamentoMensal),
      rules,
    });
  }
}
