import user from "./users";
import transactions from "./transactions";
import { sequelizeConnection } from "../config/db";

user.hasMany(transactions, { foreignKey: "user_id", sourceKey: "id" });
transactions.belongsTo(user, { foreignKey: "user_id", targetKey: "id" });

sequelizeConnection
  .sync()
  .then(() => {
    console.log("Synced successfully");
  })
  .catch((err) => {
    console.log(err);
  });

export { user, transactions };
