module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define('Registration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Submitted', 'Paid', 'Cancelled', 'Completed'),
      defaultValue: 'Submitted'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    staffNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Registration.associate = (models) => {
    Registration.belongsTo(models.User, { foreignKey: 'userId' });
    Registration.belongsTo(models.Subject, { foreignKey: 'subjectId' });
    Registration.belongsTo(models.PricePackage, { foreignKey: 'packageId' });
  };

  return Registration;
};
