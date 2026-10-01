module.exports = (sequelize, DataTypes) => {
  const QuizResult = sequelize.define('QuizResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    totalCorrect: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  QuizResult.associate = (models) => {
    QuizResult.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    QuizResult.belongsTo(models.User, { foreignKey: 'userId' });
    QuizResult.hasMany(models.QuizAnswer, { foreignKey: 'quizResultId' });
  };

  return QuizResult;
};
