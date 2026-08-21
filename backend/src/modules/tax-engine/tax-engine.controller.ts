import { Body, Controller, Post } from '@nestjs/common';
import { TaxEngineService } from './tax-engine.service';
import { CompaniesService } from '../companies/companies.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

class ApurarImpostosDto {
  @IsUUID()
  companyId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  faturamentoMensal: number;
}

@Controller('tax-engine')
export class TaxEngineController {
  constructor(
    private readonly taxEngineService: TaxEngineService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Post('apurar')
  async apurar(@CurrentTenant() tenantId: string, @Body() dto: ApurarImpostosDto) {
    const company = await this.companiesService.findOne(tenantId, dto.companyId);
    return this.taxEngineService.apurar(company, dto.faturamentoMensal);
  }
}
