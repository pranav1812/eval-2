/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // table name: CompanyTags
    await queryInterface.createTable('CompanyTags', {
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tagId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'name',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CompanyTags');
  },
};
