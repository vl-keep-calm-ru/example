import { DataTypes } from "sequelize";
import { sequelize } from "./../database";

const Actor = sequelize.define("actors", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
});

export { Actor };
