import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'testae',
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
    it('should be rejected if username already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'testae',
          name: 'test',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'testae',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
    it('should be rejected if credentials is wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'salah',
          password: 'salah password',
        });
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'token is wrong');
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });
  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'token test')
        .send({
          password: '',
          name: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to update name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'token test')
        .send({
          name: 'test updated',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test updated');
    });
    it('should be able to update password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'token test')
        .send({
          password: 'new password',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'new password',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });
  describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'token is wrong');
      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to logout', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'token test');
      const logoutUser = await testService.getUser();
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
      expect(logoutUser.token).toBeNull();
    });
  });
});
