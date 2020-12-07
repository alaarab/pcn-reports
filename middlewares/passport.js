import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "db/models/user";

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (req, user, done) => {
  user = await User.findOne({
    where: {
      id: user.id,
    },
  });
  done(null, user);
});

// const azureStrategy = new OIDCStrategy(
//   {
//     identityMetadata: `${process.env.AZURE_AUTHORITY_PREFIX}${process.env.AZURE_TENANT}/${process.env.AZURE_ID_METADATA}`,
//     clientID: process.env.AZURE_ID,
//     clientSecret: process.env.AZURE_SECRET,
//     responseType: "code id_token",
//     responseMode: "form_post",
//     redirectUrl: `${process.env.ORIGIN}/api/auth/azure/callback`,
//     scope: process.env.AZURE_SCOPES.split(" "),
//     allowHttpForRedirectUrl: true,
//     loggingLevel: "error",
//     passReqToCallback: false,
//     validateIssuer: false,
//     // tempfix: use cookie, not session [to prevent cookie issue: authentication failed due to: In collectInfoFromReq: invalid state received in the request ]
//     useCookieInsteadOfSession: true,
//     cookieEncryptionKeys: [
//       { key: "12345678901234567890123456789012", iv: "123456789012" },
//     ],
//   },
//   async function (iss, sub, profile, accessToken, refreshToken, params, done) {
//     if (!profile.oid) {
//       return done(new Error("No oid found"), null);
//     }

//     try {
//       const oauth = new AuthorizationCode({
//         client: {
//           id: process.env.AZURE_ID,
//           secret: process.env.AZURE_SECRET,
//         },
//         auth: {
//           tokenHost: `${process.env.AZURE_AUTHORITY_PREFIX}${process.env.AZURE_TENANT}/`,
//           authorizePath: process.env.AZURE_AUTHORIZE_ENDPOINT,
//           tokenPath: process.env.AZURE_TOKEN_ENDPOINT,
//         },
//       });
//       let oauthToken = await oauth.createToken(params);
//       let user = undefined;

//       // Scenario 1: If the Azure Match exists, Login
//       user = await User.findOneAndUpdate(
//         {
//           email: profile._json.email.toLowerCase(),
//           "third_party_auth.azure.uid": profile.oid,
//         },
//         {
//           $set: {
//             "third_party_auth.azure.oauthToken": oauthToken.token,
//           },
//         }
//       );
//       if (user) return done(null, user);

//       // Scenario 2: If the e-mail exists without Azure Match, Associate the account
//       user = await User.findOneAndUpdate(
//         {
//           email: profile._json.email.toLowerCase(),
//         },
//         {
//           $set: {
//             "third_party_auth.azure.uid": profile.oid,
//             "third_party_auth.azure.oauthToken": oauthToken.token,
//           },
//         }
//       );
//       if (user) return done(null, user);

//       // Scenario 3: If the e-mail doesn't exist at all, Auto-Register
//       user = await User.insertOne({
//         email: profile._json.email.toLowerCase(),
//         name: profile.displayName,
//         third_party_auth: {
//           azure: {
//             uid: profile.oid,
//             oauthToken: oauthToken.token,
//           },
//         },
//       });
//       if (user) return done(null, user);
//     } catch (error) {
//       console.log(error);
//       done(null, false, { message: error.message });
//     }
//   }
// );

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  (email, password, done) => {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        } else if (!user.password) {
          return done(null, false, {
            message: "User has not set password",
          });
          // CREATE A SALT PASSWORD
          // bcrypt.genSalt(10, function(err, salt) {
          //     bcrypt.hash("Password123", salt, async function(err, hash) {
          //       // Scenario 2: If the e-mail exists without Azure Match, Associate the account
          //       res = await User.findOneAndUpdate({
          //         email: email.toLowerCase(),
          //       }, {
          //         $set: { password: hash }
          //       }, {
          //         returnOriginal: false
          //       });
          //       user = res?.value
          //       if (user) return done(null, user);
          //     });
          // });
          // return done(null, user);
        } else {
          bcrypt.compare(password, user.password, async (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong Password" });
            }
          });
        }
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  }
);

passport.use(localStrategy);
// passport.use(azureStrategy);

export default passport;
