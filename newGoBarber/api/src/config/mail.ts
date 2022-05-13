interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ehthereal',
  defaults: {
    from: {
      // este email sera o email cadastrado no aws
      email: 'equipe.gobarber@chrystiantestegobaerber.tech',
      name: 'Chrystian <Equipe Go Barber>',
    },
  },
} as IMailConfig;
