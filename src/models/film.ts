import { DataTypes } from "sequelize";
import { sequelize } from "./../database";
import { Actor } from "./actor";

const Film = sequelize.define("films", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
});
const FilmActor = sequelize.define("film_actor", {}, { timestamps: false });

Film.belongsToMany(Actor, { through: FilmActor });

export { Film };
