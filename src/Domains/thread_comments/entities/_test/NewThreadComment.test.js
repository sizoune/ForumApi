const NewThreadComment = require('../NewThreadComment');

describe('a NewThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'thread comment',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'thread comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const threadComment = new NewThreadComment(payload);

    // Assert
    expect(threadComment).toBeInstanceOf(NewThreadComment);
    expect(threadComment.content).toEqual(payload.content);
  });
});
