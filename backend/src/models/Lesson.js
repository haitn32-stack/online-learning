module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Subject, { foreignKey: 'subjectId' });
  };

  return Lesson;
};
