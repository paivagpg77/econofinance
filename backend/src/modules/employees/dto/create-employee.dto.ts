import { IsDateString, IsNotEmpty, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  nome: string;

  @Length(11, 11, { message: 'CPF deve conter 11 dígitos' })
  cpf: string;

  @IsNotEmpty()
  cargo: string;

  @IsNumber()
  @IsPositive()
  salarioBase: number;

  @IsDateString()
  dataAdmissao: string;
}
