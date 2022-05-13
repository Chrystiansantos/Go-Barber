module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    /* Aqui estou dizendo que irei remover a coluna avatar_id dentro da tabela
    users */
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
