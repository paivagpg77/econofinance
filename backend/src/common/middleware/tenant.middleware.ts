import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

declare module 'express' {
  interface Request {
    tenantId?: string;
    userId?: string;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Como o app.module possui o prefixo global /api,
    // aqui verificamos apenas a parte /auth/...
    const publicRoutes = [
      '/auth/register',
      '/auth/login',
    ];

    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token de autenticação ausente');
    }

    try {
      const token = authHeader.replace('Bearer ', '');

      const payload = this.jwtService.decode(token) as {
        sub: string;
        tenantId: string;
      };

      if (!payload?.tenantId) {
        throw new UnauthorizedException(
          'Token inválido: tenant não identificado',
        );
      }

      req.tenantId = payload.tenantId;
      req.userId = payload.sub;

      next();
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}