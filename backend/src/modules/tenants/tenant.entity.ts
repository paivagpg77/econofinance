import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Company } from '../companies/company.entity';

export enum TenantStatus {
  TRIAL = 'trial',
  ATIVO = 'ativo',
  SUSPENSO = 'suspenso',
  CANCELADO = 'cancelado',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome_fantasia' })
  nomeFantasia: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL })
  status: TenantStatus;

  @OneToMany(() => Company, (company) => company.tenant)
  companies: Company[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
