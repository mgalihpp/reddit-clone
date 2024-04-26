import { check, ValidationChain } from 'express-validator';

class CommentValidator {
  commentPayloadValidationRules: ValidationChain[];
  commentVotePayloadValidationRules: ValidationChain[];

  constructor() {
    this.commentPayloadValidationRules = [
      check('postId').isString(),
      check('text').isString(),
      check('replyId').isString().optional(),
    ];
    this.commentVotePayloadValidationRules = [
      check('commentId').isString(),
      check('voteType').isIn(['UP', 'DOWN']),
    ];
  }
}

export default new CommentValidator();
