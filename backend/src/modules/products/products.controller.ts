import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('companies/:companyId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(tenantId, companyId, dto);
  }

  @Get()
  findAll(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.productsService.findAll(tenantId, companyId);
  }

  @Get('resumo')
  resumo(@CurrentTenant() tenantId: string, @Param('companyId') companyId: string) {
    return this.productsService.resumoEstoque(tenantId, companyId);
  }
}
