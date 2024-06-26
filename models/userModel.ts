import { Schema, model, connect } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

interface IUser {
  userAvatar: string;
  email: string;
  password: string;
  isAccountActive: boolean;
  name: string;
}

const userSchema = new Schema<IUser>(
  {
    userAvatar: String,
    email: {
      type: String,
      required: [true, "Enter your email address"],
      validate: [isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Create a password"],
      minlength: [6, "The password should be a minimum of 6 characters"],
    },
    name: { type: String, required: [true, "Please, provide a name"] },
    isAccountActive: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  this.isAccountActive = false;
  next();
});
const User = model<IUser>("User", userSchema);

export default User;
