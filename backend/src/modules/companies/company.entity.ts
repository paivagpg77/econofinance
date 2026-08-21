import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

export enum RegimeTributario {
  SIMPLES_NACIONAL = 'simples_nacional',
  LUCRO_PRESUMIDO = 'lucro_presumido',
  LUCRO_REAL = 'lucro_real',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Isolamento multi-tenant: toda query nesta tabela deve filtrar por tenantId
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.companies)
  tenant: Tenant;

  @Column({ unique: true, length: 14 })
  cnpj: string;

  @Column({ name: 'razao_social' })
  razaoSocial: string;

  @Column({ name: 'cnae_principal', length: 7 })
  cnaePrincipal: string;

  @Column({ length: 2 })
  uf: string;

  @Column()
  municipio: string;

  @Column({ name: 'regime_tributario', type: 'enum', enum: RegimeTributario })
  regimeTributario: RegimeTributario;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
