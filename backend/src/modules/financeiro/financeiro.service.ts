import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { Transaction, TipoTransacao } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class FinanceiroService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(tenantId: string, companyId: string, dto: CreateTransactionDto): Promise<Transaction> {
    await this.companiesService.findOne(tenantId, companyId);
    const transaction = this.transactionsRepo.create({ ...dto, companyId });
    return this.transactionsRepo.save(transaction);
  }

  async findAll(tenantId: string, companyId: string): Promise<Transaction[]> {
    await this.companiesService.findOne(tenantId, companyId);
    return this.transactionsRepo.find({ where: { companyId }, order: { data: 'DESC' } });
  }

  /** DRE simplificado: receitas - despesas do período que já foi lançado */
  async resumo(tenantId: string, companyId: string) {
    const transacoes = await this.findAll(tenantId, companyId);

    const receitas = transacoes
      .filter((t) => t.tipo === TipoTransacao.RECEITA)
      .reduce((soma, t) => soma.plus(new Decimal(t.valor)), new Decimal(0));

    const despesas = transacoes
      .filter((t) => t.tipo === TipoTransacao.DESPESA)
      .reduce((soma, t) => soma.plus(new Decimal(t.valor)), new Decimal(0));

    return {
      totalReceitas: receitas.toFixed(2),
      totalDespesas: despesas.toFixed(2),
      saldo: receitas.minus(despesas).toFixed(2),
      totalLancamentos: transacoes.length,
    };
  }
}
