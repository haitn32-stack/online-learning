module.exports = (sequelize, DataTypes) => {
  const QuizAnswer = sequelize.define('QuizAnswer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    selectedAnswer: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: true
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  QuizAnswer.associate = (models) => {
    QuizAnswer.belongsTo(models.QuizResult, { foreignKey: 'quizResultId' });
    QuizAnswer.belongsTo(models.Question, { foreignKey: 'questionId' });
  };

  return QuizAnswer;
};
