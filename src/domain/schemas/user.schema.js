import mongoose from "mongoose";

// TODO: Definir el esquema de la DB
// const movementSchema = new mongoose.Schema(
//   {
//     day: { type: Number, min: 1, max: 31, required: true},
//     description: { type: String, required: true },
//     category: { type: String, required: true },
//     subcategory: { type: String, required: true },
//     account: { type: String, required: true },
//     amount: { type: Number, required: true },
//     transfer: { type: Boolean, required: true }
//   }
// )

// const monthSchema = new mongoose.Schema(
//   {
//     month: { type: String, required: true },
//     movement: [ movementSchema ]
//   }
// )

// const yearSchema = new mongoose.Schema(
//   {
//     year: { type: String, required: true },
//     months: [ monthSchema ]
//   }
// )

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