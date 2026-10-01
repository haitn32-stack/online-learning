module.exports = (sequelize, DataTypes) => {
  const SubjectDimension = sequelize.define('SubjectDimension', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  SubjectDimension.associate = (models) => {
    SubjectDimension.belongsTo(models.Subject, { foreignKey: 'subjectId' });
    SubjectDimension.hasMany(models.Question, { foreignKey: 'dimensionId' });
  };

  return SubjectDimension;
};
