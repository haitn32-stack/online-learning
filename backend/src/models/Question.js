module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: false
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
      defaultValue: 'Medium'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Subject, { foreignKey: 'subjectId' });
    Question.belongsTo(models.SubjectDimension, { foreignKey: 'dimensionId' });
    Question.belongsToMany(models.Quiz, { through: models.QuizQuestion, foreignKey: 'questionId' });
    Question.hasMany(models.QuizAnswer, { foreignKey: 'questionId' });
  };

  return Question;
};
