import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Tenant, TenantStatus } from '../tenants/tenant.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Tenant) private readonly tenantsRepo: Repository<Tenant>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existente = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    // Cada novo cadastro cria um tenant novo — é o ponto de entrada do SaaS
    const tenant = await this.tenantsRepo.save(
      this.tenantsRepo.create({
        nomeFantasia: dto.nomeFantasia,
        email: dto.email,
        status: TenantStatus.TRIAL,
      }),
    );

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        tenantId: tenant.id,
        nome: dto.nome,
        email: dto.email,
        senhaHash,
      }),
    );

    return this.gerarToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.senha, user.senhaHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    return this.gerarToken(user);
  }

  private gerarToken(user: User) {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, nome: user.nome, email: user.email },
    };
  }
}
