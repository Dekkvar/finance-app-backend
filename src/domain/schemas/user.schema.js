import mongoose from "mongoose";

export const userSchemas = () => {
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      dob: { type: Date },
      accounts: { type: [], required: true, default: ["cash"] },
      categories: { type: Map, of: Array, required: true },
      movements: { type: Map, required: true }
    }
  );

  return mongoose.models.Users || mongoose.model('Users', userSchema);
};