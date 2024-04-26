import { check, ValidationChain } from 'express-validator';

class UserValidator {
  updateUserPayloadValidationRules: ValidationChain[];

  constructor() {
    this.updateUserPayloadValidationRules = [
      check('name').isString().isLength({ min: 3, max: 21 }),
      check('username').isString().optional(),
      check('image').isString().optional(),
    ];
  }
}

export default new UserValidator();
