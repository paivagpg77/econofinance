import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxRule } from './tax-rule.entity';
import { TaxEngineService } from './tax-engine.service';
import { TaxEngineController } from './tax-engine.controller';
import { SimplesNacionalStrategy } from './strategies/simples-nacional.strategy';
import { LucroPresumidoStrategy } from './strategies/lucro-presumido.strategy';
import { LucroRealStrategy } from './strategies/lucro-real.strategy';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaxRule]), CompaniesModule],
  providers: [TaxEngineService, SimplesNacionalStrategy, LucroPresumidoStrategy, LucroRealStrategy],
  controllers: [TaxEngineController],
  exports: [TaxEngineService],
})
export class TaxEngineModule {}
