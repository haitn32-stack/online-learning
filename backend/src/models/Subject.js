module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tagLine: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Subject.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    Subject.hasMany(models.SubjectDimension, { foreignKey: 'subjectId', as: 'dimensions' });
    Subject.hasMany(models.PricePackage, { foreignKey: 'subjectId', as: 'pricePackages' });
    Subject.hasMany(models.Lesson, { foreignKey: 'subjectId', as: 'lessons' });
    Subject.hasMany(models.Question, { foreignKey: 'subjectId', as: 'questions' });
    Subject.hasMany(models.Quiz, { foreignKey: 'subjectId', as: 'quizzes' });
    Subject.hasMany(models.Registration, { foreignKey: 'subjectId', as: 'registrations' });
  };

  return Subject;
};
