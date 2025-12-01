import { NextFunction, Request, Response } from "express";

export type Handler = (req: Request, res: Response) => any;
export type MHandler = (req: Request, res: Response, next: NextFunction) => any;

export enum StatusCode {
  Success = 200,
  Created = 201,
  InputError = 411,
  DocumentExists = 403,
  ServerError = 500,
  NotFound = 404,
  Unauthorized = 401,
}