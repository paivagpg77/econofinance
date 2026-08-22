import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

export enum TipoTransacao {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export enum StatusTransacao {
  PENDENTE = 'pendente',
  PAGO = 'pago',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'enum', enum: TipoTransacao })
  tipo: TipoTransacao;

  @Column()
  categoria: string;

  @Column('decimal', { precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'date' })
  data: Date;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ type: 'enum', enum: StatusTransacao, default: StatusTransacao.PENDENTE })
  status: StatusTransacao;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
