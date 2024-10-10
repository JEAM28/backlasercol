import { NextFunction, Request, Response } from 'express';

export function loggerFunc(req: Request, res: Response, next: NextFunction) {
  const getDate = () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'America/Bogota',
    });
  };
  console.log(`${req.method}/ ${req.url} - Cuando?: ${getDate()}`);

  next();
}
