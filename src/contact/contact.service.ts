import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async checkContactExists(
    userId: string,
    contactId: string,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findUnique({
      where: {
        user_id: userId,
        id: contactId,
      },
    });
    if (!contact) {
      throw new HttpException('Contact is not found', 404);
    }
    return contact;
  }
  toContactResponse(contact: Contact): ContactResponse {
    const { user_id, ...rest } = contact;
    return {
      ...rest,
    };
  }
  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.info(
      `Contact create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );
    const newContact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        user_id: user.id,
      },
    });
    return this.toContactResponse(newContact);
  }
  async get(user: User, contactId: string): Promise<ContactResponse> {
    const contact = await this.checkContactExists(user.id, contactId);
    return this.toContactResponse(contact);
  }
  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateRequest: UpdateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );
    let contact = await this.checkContactExists(user.id, updateRequest.id);
    contact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
        user_id: contact.user_id,
      },
      data: updateRequest,
    });
    return this.toContactResponse(contact);
  }
}
