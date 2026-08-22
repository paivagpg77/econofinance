import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TipoTransacao } from '../transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TipoTransacao)
  tipo: TipoTransacao;

  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsDateString()
  data: string;

  @IsOptional()
  descricao?: string;
}
