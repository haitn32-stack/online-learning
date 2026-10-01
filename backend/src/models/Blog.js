module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
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
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    briefInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Blog.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };

  return Blog;
};
