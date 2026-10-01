module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false
    },
    passRate: {
      type: DataTypes.INTEGER, // percentage
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('Easy', 'Medium', 'Hard', 'Mixed'),
      allowNull: false
    },
    questionCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Practice', 'Test'),
      defaultValue: 'Practice'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Subject, { foreignKey: 'subjectId' });
    Quiz.belongsToMany(models.Question, { through: models.QuizQuestion, foreignKey: 'quizId' });
    Quiz.hasMany(models.QuizResult, { foreignKey: 'quizId' });
  };

  return Quiz;
};
