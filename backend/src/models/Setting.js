module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    settingType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    settingKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    orderNum: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['settingType', 'settingKey']
      }
    ]
  });

  return Setting;
};
