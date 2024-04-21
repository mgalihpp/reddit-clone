import { check, ValidationChain } from 'express-validator';

class PostValidator {
  postPayloadValidationRules: ValidationChain[];

  constructor() {
    this.postPayloadValidationRules = [
      check('subredditName').isString().optional(),
      check('limit').isString(),
      check('page').isString(),
    ];
  }
}

export default new PostValidator();
