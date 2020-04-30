// /* eslint-disable @typescript-eslint/no-explicit-any */
// import passport from 'passport';
// import passportLocal from 'passport-local';
// const strategy = passportLocal.Strategy;

// function initializePassport(passport: any, getUserByEmail: any) {
//   const authenticateUser = (email: string, password: string, done: any) => {
//     const user = getUserByEmail(email);
//     console.log(user);
//     if (user == null) {
//       return done(null, false, { message: 'No user with that email' });
//     } else {
//       return done(null, user);
//     }
//   };
//   passport.use(new strategy({ usernameField: 'email' }, authenticateUser));

//   passport.serializeUser((user: any, done: any) => {
//     console.log('seria - ' + user.email);
//     return done(null, user.email);
//   });

//   passport.deserializeUser((email: string, done: any) => {
//     console.log('deser - ');
//     console.log(getUserByEmail(email));
//     return done(null, getUserByEmail(email));
//   });
// }

// export default initializePassport;

//app.ts
// passport.authenticate('local', { failureRedirect: '/login' }),
// function(req: any, res) {
//   const email = req.user.email;
//   const token = jwt.sign({ email: email }, configKey, {
//     expiresIn: '1h'
//   });
//   return res.json({ token });
// }

// initializePassport(passport, (email: string) =>
//   users.find(user => user.email === email)
// );
