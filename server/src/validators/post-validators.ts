import { check, ValidationChain } from 'express-validator';

class PostValidator {
  postPayloadValidationRules: ValidationChain[];
  createPostPayloadValidationRules: ValidationChain[];

  constructor() {
    this.postPayloadValidationRules = [
      check('subredditName').isString().optional(),
      check('limit').isString(),
      check('page').isString(),
    ];
    this.createPostPayloadValidationRules = [
      check('title').isString(),
      check('content').notEmpty(),
      check('subredditId').isString(),
    ];
  }
}

export default new PostValidator();
