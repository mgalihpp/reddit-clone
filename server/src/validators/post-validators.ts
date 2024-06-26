import { check, param, ValidationChain } from 'express-validator';

class PostValidator {
  postPayloadValidationRules: ValidationChain[];
  createPostPayloadValidationRules: ValidationChain[];
  votePostPayloadValidationRules: ValidationChain[];
  postIdValidationRules: ValidationChain[];

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
    this.votePostPayloadValidationRules = [
      check('postId').isString(),
      check('voteType').isIn(['UP', 'DOWN']),
    ];
    this.postIdValidationRules = [param('postId').isString()];
  }
}

export default new PostValidator();
