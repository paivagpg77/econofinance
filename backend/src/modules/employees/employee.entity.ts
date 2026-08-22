import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

export enum StatusFuncionario {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  nome: string;

  @Column({ length: 11 })
  cpf: string;

  @Column()
  cargo: string;

  @Column({ name: 'salario_base', type: 'decimal', precision: 12, scale: 2 })
  salarioBase: number;

  @Column({ name: 'data_admissao', type: 'date' })
  dataAdmissao: Date;

  @Column({ name: 'data_demissao', type: 'date', nullable: true })
  dataDemissao?: Date;

  @Column({ type: 'enum', enum: StatusFuncionario, default: StatusFuncionario.ATIVO })
  status: StatusFuncionario;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
