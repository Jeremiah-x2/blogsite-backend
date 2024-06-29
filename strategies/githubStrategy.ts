import passport from "passport";
import { Strategy } from "passport-github2";
import User from "../models/userModel";

export default passport.use(
  new Strategy(
    {
      clientID: "Ov23lidI0lmaifX48hT2",
      clientSecret: "5c0aea297ac216455dbc67287d153f0d2024f7f1",
      callbackURL: "http://localhost:8000/user/gitoauth/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log(profile);
    }
  )
);
