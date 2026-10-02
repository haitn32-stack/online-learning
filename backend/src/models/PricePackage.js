module.exports = (sequelize, DataTypes) => {
  const PricePackage = sequelize.define('PricePackage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // in days
      allowNull: false
    },
    listPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  PricePackage.associate = (models) => {
    PricePackage.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    PricePackage.hasMany(models.Registration, { foreignKey: 'packageId' });
  };

  return PricePackage;
};
