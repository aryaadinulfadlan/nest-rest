import { Inject, Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { AddressResponse, CreateAddressRequest } from '../model/address.model';
import { Logger } from 'winston';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  toAddressResponse(address: Address): AddressResponse {
    const { contact_id, ...rest } = address;
    return {
      ...rest,
    };
  }
  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );
    await this.contactService.checkContactExists(
      user.id,
      createRequest.contact_id,
    );
    const newAddress = await this.prismaService.address.create({
      data: createRequest,
    });
    return this.toAddressResponse(newAddress);
  }
}
