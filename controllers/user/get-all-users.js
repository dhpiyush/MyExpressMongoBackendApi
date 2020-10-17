import User from "../../models/user";
import factory from "../handler-factory";

export const getAllUsers = factory.getAll(
  User,
  ["name", "email", "role"],
  "users"
);
