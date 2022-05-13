import UpdatedUserAvatarService from '@modules/users/services/UpdatedUserAvatarService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updatedUserAvatar = container.resolve(UpdatedUserAvatarService);
    const user = await updatedUserAvatar.execute({
      user_id: req.user.id,
      avatarFileName: req.file.filename,
    });

    return res.json(classToClass(user));
  }
}
