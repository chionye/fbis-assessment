import user from "./users";
import transaction from "./transactions";
import { sequelizeConnection } from "../config/db";

user.hasMany(transaction, { foreignKey: "uid", sourceKey: "id" });
transaction.belongsTo(user, { foreignKey: "uid", targetKey: "id" });

sequelizeConnection
  .sync()
  .then(() => {
    console.log("Synced successfully");
  })
  .catch((err) => {
    console.log(err);
  });