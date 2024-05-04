import { check, ValidationChain } from 'express-validator';

class SubredditValidator {
  subredditPayloadValidationRules: ValidationChain[];
  updateSubredditPayloadValidationRules: ValidationChain[];
  subscriptionPayloadValidationRules: ValidationChain[];

  constructor() {
    this.subredditPayloadValidationRules = [
      check('name').isString().isLength({ min: 3, max: 21 }),
    ];
    this.updateSubredditPayloadValidationRules = [
      check('id').isString(),
      check('image').isString().optional(),
      check('description').isString().optional(),
    ];
    this.subscriptionPayloadValidationRules = [check('subredditId').isString()];
  }
}

export default new SubredditValidator();
