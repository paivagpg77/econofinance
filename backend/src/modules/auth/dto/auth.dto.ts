import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nomeFantasia: string; // nome do tenant (empresa que está assinando o SaaS)

  @IsNotEmpty()
  nome: string; // nome do usuário responsável

  @IsEmail()
  email: string;

  @MinLength(8, { message: 'Senha deve ter ao menos 8 caracteres' })
  senha: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;
}
