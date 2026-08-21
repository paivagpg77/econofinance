import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RegimeTributario } from '../companies/company.entity';

export enum TipoImposto {
  ICMS = 'icms',
  ISS = 'iss',
  PIS = 'pis',
  COFINS = 'cofins',
  IRPJ = 'irpj',
  CSLL = 'csll',
  DAS = 'das',
}

/**
 * Tabela de configuração (não pertence a nenhum tenant): é a base de regras
 * fiscais do sistema. Cada empresa cliente consulta essa tabela filtrando por
 * regime + CNAE + UF em vez de ter a alíquota fixada em código.
 */
@Entity('tax_rules')
export class TaxRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RegimeTributario })
  regimeTributario: RegimeTributario;

  @Column({ length: 7, nullable: true })
  cnae?: string;

  @Column({ length: 2, nullable: true })
  uf?: string;

  @Column({ type: 'enum', enum: TipoImposto })
  tipoImposto: TipoImposto;

  @Column('decimal', { precision: 6, scale: 4 })
  aliquota: number;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  faixaFaturamentoMin?: number;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  faixaFaturamentoMax?: number;

  @Column({ type: 'date' })
  vigenciaInicio: Date;

  @Column({ type: 'date', nullable: true })
  vigenciaFim?: Date;
}
