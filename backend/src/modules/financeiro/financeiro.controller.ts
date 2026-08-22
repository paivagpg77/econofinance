import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('companies/:companyId/transactions')
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.financeiroService.create(tenantId, companyId, dto);
  }

  @Get()
  findAll(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.financeiroService.findAll(tenantId, companyId);
  }

  @Get('resumo')
  resumo(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.financeiroService.resumo(tenantId, companyId);
  }
}
