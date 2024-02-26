import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const connect = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });
  return sequelize;
};

export { connect, sequelize };
