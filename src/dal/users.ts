import { user } from "../models";
import { UserAttributes } from "../types";

export const createUser = async (payload: UserAttributes) => {
  const foundUser = await user.findAll({
    where: {
      email: payload.email,
    },
  });
  if (foundUser) {
    throw new Error("user already exists");
  }
  const newUser = await user.create(payload);
  return newUser;
};

export const updateUser = async (id: number, payload: UserAttributes) => {
  const foundUser = await user.findByPk(id);
  if (!foundUser) {
    throw new Error("user not found");
  }
  const updatedUser = await user.update(payload, {
    where: { id },
  });
  return updatedUser;
};

export const checkUserBalance = async (id: number, amount: number) => {
  const foundUser:any = await user.findByPk(id);
  if (!foundUser) {
    throw new Error("user not found");
  }
  if (foundUser.balance < amount) {
    throw new Error("insufficient balance");
  }
  return foundUser;
};
