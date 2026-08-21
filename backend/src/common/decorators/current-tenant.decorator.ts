import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Uso: findAll(@CurrentTenant() tenantId: string)
 * Evita ficar lendo req.tenantId manualmente em cada controller.
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
  },
);
