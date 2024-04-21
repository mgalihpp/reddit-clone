import { check, ValidationChain } from 'express-validator';

class PostValidator {
  postPayloadVlidationRules: ValidationChain[];

  constructor() {
    this.postPayloadVlidationRules = [
      check('subredditName').isString().optional(),
      check('limit').isString(),
      check('page').isString(),
    ];
  }
}

export default new PostValidator();
