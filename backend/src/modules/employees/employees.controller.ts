import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('companies/:companyId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(tenantId, companyId, dto);
  }

  @Get()
  findAll(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.employeesService.findAll(tenantId, companyId);
  }

  @Get('resumo')
  resumo(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.employeesService.resumoFolha(tenantId, companyId);
  }
}
