import { model, models, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  phone: string;
  country: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: Date;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  isClient: boolean;
  resetToken: string;
  resetTokenExp: Date | null;
}
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "An email address is required!"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required for sign up"],
    },
    phone: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneNumberVerified: {
        type: Boolean,
        default: false,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth of user is required!"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required!"]
    },
    middleName: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: [true, "Country of residence is required!"]
    },
    isClient: {
      type: Boolean,
      required: [true, "Status of User is required!"]
    },
    resetToken: {
      type: String,
      default: ""
    },
    resetTokenExp: {
      type: Date || null,
      default: null,
    }
});

export const User = models.User || model<IUser>("User", userSchema)  