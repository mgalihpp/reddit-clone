import { check, query, ValidationChain } from 'express-validator';

class UserValidator {
  updateUserPayloadValidationRules: ValidationChain[];
  getUserByNameValidationRules: ValidationChain[];

  constructor() {
    this.updateUserPayloadValidationRules = [
      check('name').isString().isLength({ min: 3, max: 50 }),
      check('username').isString().optional(),
      check('image').isString().optional(),
    ];
    this.getUserByNameValidationRules = [query('username').isString()];
  }
}

export default new UserValidator();
