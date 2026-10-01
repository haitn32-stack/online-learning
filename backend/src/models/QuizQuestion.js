module.exports = (sequelize, DataTypes) => {
  const QuizQuestion = sequelize.define('QuizQuestion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false
  });

  return QuizQuestion;
};
