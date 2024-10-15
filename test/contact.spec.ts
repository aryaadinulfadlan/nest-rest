import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Contact Controller', () => {
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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'token test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to create new contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'token test')
        .send({
          first_name: 'test',
          // last_name: '',
          email: 'test@test.com',
          // phone: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.email).toBe('test@test.com');
    });
  });
  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}jadi_salah`)
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to get contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.email).toBe('test@test.com');
    });
  });
  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if validation is failed', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'token test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be rejected if contactId is invalid (even validation success)', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}jadi_salah`)
        .set('Authorization', 'token test')
        .send({
          first_name: 'test',
          last_name: 'testa',
          email: 'test@test.com',
          phone: '9090',
        });
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'token test')
        .send({
          first_name: 'test updated',
          last_name: 'testa updated',
          email: 'update@update.com',
          phone: '90update',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test updated');
      expect(response.body.data.last_name).toBe('testa updated');
      expect(response.body.data.email).toBe('update@update.com');
      expect(response.body.data.phone).toBe('90update');
    });
  });
  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}jadi_salah`)
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to delete contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
  describe('SEARCH /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be able to search contacts without any query params', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
    it('should be able to search contacts with page and size params', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          size: 1,
          page: 2,
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
    it('should be able to search contacts by name not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          name: 'wrong name',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });
    it('should be able to search contacts by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          name: 'es',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
    it('should be able to search contacts by email not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          email: 'wrong email',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });
    it('should be able to search contacts by email', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          email: 'test.com',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
    it('should be able to search contacts by phone not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          phone: 'wrong phone',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });
    it('should be able to search contacts by phone', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({
          phone: '9090',
        })
        .set('Authorization', 'token test');
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
});
