import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
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
  async checkAddressExists(
    addressId: string,
    contactId: string,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });
    if (!address) {
      throw new HttpException('Address is not found', 404);
    }
    return address;
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
  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );
    await this.contactService.checkContactExists(
      user.id,
      getRequest.contact_id,
    );
    const address = await this.checkAddressExists(
      getRequest.address_id,
      getRequest.contact_id,
    );
    return this.toAddressResponse(address);
  }
  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );
    await this.contactService.checkContactExists(
      user.id,
      updateRequest.contact_id,
    );
    let address = await this.checkAddressExists(
      updateRequest.id,
      updateRequest.contact_id,
    );
    address = await this.prismaService.address.update({
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
      data: updateRequest,
    });
    return this.toAddressResponse(address);
  }
  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const removeRequest: RemoveAddressRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );
    await this.contactService.checkContactExists(
      user.id,
      removeRequest.contact_id,
    );
    await this.checkAddressExists(
      removeRequest.address_id,
      removeRequest.contact_id,
    );
    const address = await this.prismaService.address.delete({
      where: {
        id: removeRequest.address_id,
        contact_id: removeRequest.contact_id,
      },
    });
    return this.toAddressResponse(address);
  }
}
