import { check, ValidationChain } from 'express-validator';

class SubredditValidator {
  subredditPayloadValidationRules: ValidationChain[];
  subscriptionPayloadValidationRules: ValidationChain[];

  constructor() {
    this.subredditPayloadValidationRules = [
      check('name').isString().isLength({ min: 3, max: 21 }),
    ];
    this.subscriptionPayloadValidationRules = [
      check('subredditId').isString(),
    ];
  }
}

export default new SubredditValidator();
