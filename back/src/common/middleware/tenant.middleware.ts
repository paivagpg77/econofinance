import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

// Estende o tipo Request do Express para carregar o tenantId em toda a aplicação
declare module 'express' {
  interface Request {
    tenantId?: string;
    userId?: string;
  }
}

/**
 * Todo request autenticado precisa carregar o tenant_id do usuário logado.
 * Isso é o que garante o isolamento de dados entre empresas clientes (tenants)
 * em um banco compartilhado — nenhuma query deve rodar sem esse filtro.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Rotas públicas (login, cadastro, webhook de pagamento) não passam por aqui —
    // ficam de fora no AppModule (ver configure() em app.module.ts)
    if (!authHeader) {
      throw new UnauthorizedException('Token de autenticação ausente');
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = this.jwtService.decode(token) as { sub: string; tenantId: string };

      if (!payload?.tenantId) {
        throw new UnauthorizedException('Token inválido: tenant não identificado');
      }

      req.tenantId = payload.tenantId;
      req.userId = payload.sub;
      next();
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
