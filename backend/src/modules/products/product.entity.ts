import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  nome: string;

  @Column({ unique: true })
  sku: string;

  @Column({ length: 8, nullable: true })
  ncm?: string;

  @Column({ name: 'custo_unitario', type: 'decimal', precision: 12, scale: 2 })
  custoUnitario: number;

  @Column({ name: 'preco_venda', type: 'decimal', precision: 12, scale: 2 })
  precoVenda: number;

  @Column({ name: 'estoque_atual', type: 'int', default: 0 })
  estoqueAtual: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
