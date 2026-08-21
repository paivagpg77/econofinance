import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { RegimeTributario } from '../company.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  @Length(14, 14, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @IsNotEmpty()
  razaoSocial: string;

  @IsNotEmpty()
  @Length(7, 7, { message: 'CNAE deve conter 7 dígitos' })
  cnaePrincipal: string;

  @IsNotEmpty()
  @Length(2, 2)
  uf: string;

  @IsNotEmpty()
  municipio: string;

  @IsEnum(RegimeTributario, { message: 'Regime tributário inválido' })
  regimeTributario: RegimeTributario;
}
