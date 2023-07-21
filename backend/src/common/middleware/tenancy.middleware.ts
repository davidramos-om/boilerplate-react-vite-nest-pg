// import { BadRequestException } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';

export const TENANT_HEADER = 'x-tenant-id'

export function tenancyMiddleware(req: Request, _res: Response, next: NextFunction): void {

  const header = req.headers[ TENANT_HEADER ] as string;
  // if (!header)
  //   throw new BadRequestException('Tenant not present');

  req.tenantId = header?.toString() || null;
  next();
}