import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepo: Repository<Company>,
  ) {}

  async create(tenantId: string, dto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepo.create({ ...dto, tenantId });
    return this.companiesRepo.save(company);
  }

  async findAll(tenantId: string): Promise<Company[]> {
    // Regra de ouro do multi-tenant: NUNCA buscar sem filtrar por tenantId
    return this.companiesRepo.find({ where: { tenantId } });
  }

  async findOne(tenantId: string, id: string): Promise<Company> {
    const company = await this.companiesRepo.findOne({ where: { id, tenantId } });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return company;
  }
}
