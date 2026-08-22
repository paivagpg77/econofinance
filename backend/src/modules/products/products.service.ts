import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(tenantId: string, companyId: string, dto: CreateProductDto): Promise<Product> {
    await this.companiesService.findOne(tenantId, companyId);
    const product = this.productsRepo.create({ ...dto, companyId });
    return this.productsRepo.save(product);
  }

  async findAll(tenantId: string, companyId: string): Promise<Product[]> {
    await this.companiesService.findOne(tenantId, companyId);
    return this.productsRepo.find({ where: { companyId }, order: { nome: 'ASC' } });
  }

  async resumoEstoque(tenantId: string, companyId: string) {
    const produtos = await this.findAll(tenantId, companyId);

    const valorTotalEstoque = produtos.reduce(
      (soma, p) => soma.plus(new Decimal(p.custoUnitario).times(p.estoqueAtual)),
      new Decimal(0),
    );

    const itensBaixoEstoque = produtos.filter((p) => p.estoqueAtual <= 5).length;

    return {
      totalProdutos: produtos.length,
      valorTotalEstoque: valorTotalEstoque.toFixed(2),
      itensBaixoEstoque,
    };
  }
}
