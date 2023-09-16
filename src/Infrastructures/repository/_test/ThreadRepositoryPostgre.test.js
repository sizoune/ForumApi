const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'wildan_dicoding',
        password: 'secret_password',
      });
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const owner = 'user-123';

      const fakeIdGenerator = () => '888'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(owner, newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-888');
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-888',
          title: 'Thread title',
          owner: 'user-123',
        }),
      );
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });
      const newThreadPayload = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const owner = 'user-123';

      const newThread = new NewThread(newThreadPayload);

      const fakeIdGenerator = () => '888'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(owner, newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-888',
          title: 'Thread title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when threadId not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadByID('')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-888',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadByID('thread-888');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-888',
        title: 'thread title',
        body: 'thread body',
        date: new Date('2023-09-12T00:00:00.000Z'),
        username: 'dicoding',
      });
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when threadId not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({ id: 'thread-888' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-888')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
