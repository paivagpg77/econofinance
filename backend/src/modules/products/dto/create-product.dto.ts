import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  sku: string;

  @IsOptional()
  ncm?: string;

  @IsNumber()
  @IsPositive()
  custoUnitario: number;

  @IsNumber()
  @IsPositive()
  precoVenda: number;

  @IsInt()
  @Min(0)
  estoqueAtual: number;
}
