import { Schema, model, connect } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

interface IUser {
  email: string;
  password: string;
  isAccountActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Enter your email address'],
      validate: [isEmail, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Create a password'],
      minlength: [6, 'The password should be a minimum of 6 characters'],
    },
    isAccountActive: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  this.isAccountActive = false;
  next();
});
const User = model<IUser>('User', userSchema);

export default User;
