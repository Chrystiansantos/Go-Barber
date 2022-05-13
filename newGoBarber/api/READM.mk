# Recuperacao de senha
  **RF**
 - O usuario deve poder recuperar sua senha informando seu email;
 - O usuario deve receber um email com instrução de recuperação de email;
 - O usuario deve poder resetar sua senha.;
  **RNF**

 - Utilizar Mailtrap para testar envios em ambiente de dev.
 - Utilizar Amazon SES para envios em produção
 - O envios de emails deve acontecer em segundo plano.

  **RN**

 - O link enviado por email para resetar senha deve expitar em 2 hrs;
 - O Usuario precisao confirmar a nova senha, ao resetar sua senha;


# Atualizacao do perfil
  **RF**

  - O osuario deve poder atualizar seu nome, email e senha.

  **RNF**

  **RN**

  - O usuário nao pode altearar seu email para um email ja utilizado por outros usuario;
  - Para atualizar sua senha o usuario deve informar a senha antiga
  - Para atualizar sua senha o usuario precisa confirmar a nova senha

# PAinel do prestador
#Painel do prestado
 **RF**
  - O usuario deve poder listar seus agendamentos de um dia especifico.
  - O prestador deve receber uma notificacao sempre que houver um novo agendamento.
  - O prestador deve poder visualizar as notificações nao lidas

 **RNF**
  - Os agendamentos do prestador no dia devem ser armazenados em cache
  - As notificações do prestador devem ser armazenadas no MongoDb
  - As notificacoes do prestador devem ser enviadas em tempo-real utilizando Socket.io

 **RN**
  - A notificacao deve ter um status de lida ou não-lida para que o prestador possa controlar

# Agendamento de serviçoes
  **RF**
   - Usuario deve listar todos prestadores de servicos cadastrados
   - O usuario deve poder listar os dias de um mes com pelo menos um horário disponivel de um prestador
   - O usuario deve poder listar horarios disponiveis em um dia especifico de um prestador
   - O usuario deve poder realizar um novo agendamento com um prestador;

  **RNF**
   - A listagem de prestadores deve ser armazenada em cache.

  **RN**
   - Cada agendamento deve durar 1h exatamente
   - Os agendamentos devem estar disponiveis entre 8h as 18h (Primeiro às 8h, último às 17h)
   - O usuario nao pode agendar em um horario já ocupado
   - O usuario não pode agendar em um horário que já passou
   - O usuario nao pode agendar servicos consigo mesmo

