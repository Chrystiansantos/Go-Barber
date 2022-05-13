import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUserTokens1604166204957
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'uuid',
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            // NOME DO RELACIONAMENTO
            name: 'TokenUser',
            // NOME DA TABELA QUE SERA REFERENCIADA
            referencedTableName: 'users',
            // NOME DA COLUNA QUE SERA REFERENCIADA NA TABELA
            referencedColumnNames: ['id'],
            // NOME DA COLUNE NESSA TABELA QUE SERA REFERENCIADA
            columnNames: ['user_id'],
            // OQUE FAZER QUANDO FOR DELETADA
            onDelete: 'CASCADE',
            // OQUE FAZER QUANDO FOR ALTERADO
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_tokens');
  }
}
