import { Request, Response } from 'express';

export interface IGqlContext {
  readonly req: Request;
  readonly res: Response;
}
