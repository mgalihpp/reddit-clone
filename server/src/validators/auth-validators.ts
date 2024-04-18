import { check, ValidationChain } from "express-validator";

class AuthValidator {
  loginValidationRules: ValidationChain[];
  registerValidationRules: ValidationChain[];

  constructor() {
    this.loginValidationRules = [
      check("email").isEmail().withMessage("Invalid email format"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];

    this.registerValidationRules = [
      check("name")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Name must be at least 4 characters long"),
      check("email").isEmail().withMessage("Invalid email format"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];
  }
}

export default new AuthValidator();
