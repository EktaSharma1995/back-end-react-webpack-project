import { Request, Response } from 'express';

export const health = (req: Request, res: Response) => {
  res.send({ status: 200, message: 'success' });
};
