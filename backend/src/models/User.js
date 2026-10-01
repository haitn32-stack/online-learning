module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Student', 'Marketing', 'Expert', 'Sale'),
      defaultValue: 'Student'
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Registration, { foreignKey: 'userId' });
    User.hasMany(models.Blog, { foreignKey: 'authorId' });
    User.hasMany(models.Subject, { foreignKey: 'ownerId', as: 'ownedSubjects' });
    User.hasMany(models.QuizResult, { foreignKey: 'userId' });
  };

  return User;
};
