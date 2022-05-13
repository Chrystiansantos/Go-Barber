import CreateUserService from '@modules/users/services/CreateUserService';
import UpdatedUserAvatarService from '@modules/users/services/UpdatedUserAvatarService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({ name, email, password });

    return res.json(classToClass(user));
  }
}
