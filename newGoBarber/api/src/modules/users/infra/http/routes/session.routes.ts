import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import SessionsControler from '../controllers/SessionsController';

const sessionsControler = new SessionsControler();
const sessionRouter = Router();

sessionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsControler.create,
);

export default sessionRouter;
