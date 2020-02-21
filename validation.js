function validateRequestForRegister(req) {
  let output = {};

  if (!req.body.email) {
    output = { success: false, message: "email is missing" };
  } else if (!req.body.name) {
    output = { success: false, message: "name is missing" };
  } else if (!req.body.password) {
    output = { success: false, message: "password is missing" };
  }

  return output;
}

const _validateRequestForRegister = validateRequestForRegister;
export { _validateRequestForRegister as validateRequestForRegister };
