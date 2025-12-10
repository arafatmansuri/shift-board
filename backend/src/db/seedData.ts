import bcrypt from "bcrypt";
import { connectDB } from ".";
import { Company } from "../models/companyModel";
import { User } from "../models/userModel";
async function seedData() {
  await connectDB();

  // await User.insertMany([
  //   {
  //     email: "hire-me@anshumat.org",
  //     username: "hire-me@anshumat.org",
  //     password: bcrypt.hashSync("HireMe@2025!", 10),
  //     role: "admin",
  //   },
  //   {
  //     email: "employee1@gmail.com",
  //     username: "employee1",
  //     password: bcrypt.hashSync("User@123", 10),
  //     department: "sales",
  //     employeeCode: "EMP001",
  //   },
  // ]);
  await User.updateMany(
    { company: null },
    {
      $set: {
        company: "69398baa9c4a259d2773e628",
      },
    }
  );
  // await Company.create({
  //   companyEmail: "hire-me@anshumat.org",
  //   companyPassword: bcrypt.hashSync("HireMe@2025!", 10),
  //   companyName: "Anshumat Foundation",
  //   companySize: 20,
  // });
}
seedData().then(() => {
  console.log("Entries created");
});
