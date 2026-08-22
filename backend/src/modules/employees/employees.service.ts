import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { Employee, StatusFuncionario } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CompaniesService } from '../companies/companies.service';

// Percentuais aproximados de encargos — ajuste depois com as regras reais
const ALIQUOTA_INSS = new Decimal(0.11);
const ALIQUOTA_FGTS = new Decimal(0.08);

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(tenantId: string, companyId: string, dto: CreateEmployeeDto): Promise<Employee> {
    // Garante que a empresa pertence ao tenant logado antes de vincular o funcionário
    await this.companiesService.findOne(tenantId, companyId);

    const employee = this.employeesRepo.create({ ...dto, companyId });
    return this.employeesRepo.save(employee);
  }

  async findAll(tenantId: string, companyId: string): Promise<Employee[]> {
    await this.companiesService.findOne(tenantId, companyId);
    return this.employeesRepo.find({ where: { companyId }, order: { nome: 'ASC' } });
  }

  async resumoFolha(tenantId: string, companyId: string) {
    const funcionarios = await this.findAll(tenantId, companyId);
    const ativos = funcionarios.filter((f) => f.status === StatusFuncionario.ATIVO);

    const totalSalarios = ativos.reduce(
      (soma, f) => soma.plus(new Decimal(f.salarioBase)),
      new Decimal(0),
    );

    return {
      totalFuncionarios: funcionarios.length,
      ativos: ativos.length,
      totalSalarios: totalSalarios.toFixed(2),
      totalInss: totalSalarios.times(ALIQUOTA_INSS).toFixed(2),
      totalFgts: totalSalarios.times(ALIQUOTA_FGTS).toFixed(2),
      custoTotalEstimado: totalSalarios
        .plus(totalSalarios.times(ALIQUOTA_FGTS))
        .toFixed(2),
    };
  }
}
