import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Address Controller', () => {
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

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });
    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'token test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    it('should be able to create new address', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'token test')
        .send({
          street: 'jalan satu',
          city: 'margrave',
          province: 'georgia',
          country: 'georgia country',
          postal_code: 'geo123',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan satu');
      expect(response.body.data.city).toBe('margrave');
      expect(response.body.data.province).toBe('georgia');
      expect(response.body.data.country).toBe('georgia country');
      expect(response.body.data.postal_code).toBe('geo123');
    });
  });
});
