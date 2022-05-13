// Estou adicioando essa tipagem dentro do Request do Express
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
