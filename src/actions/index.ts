import { loginUser } from "./Users/login.action";
import { getUsers } from "./Users/get-users.action";
import { createUser, updateUser, deleteUser } from "./Users/user-crud.action";

export const server = {
  getUsers,
  loginUser,
  createUser,
  updateUser,
  deleteUser
};
