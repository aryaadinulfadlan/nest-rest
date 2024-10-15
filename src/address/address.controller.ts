import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Auth } from '../common/auth.decorator';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.addressService.create(user, request);
    return {
      data: result,
    };
  }
  @Get('/:addressId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
  ): Promise<WebResponse<AddressResponse>> {
    const request: GetAddressRequest = {
      address_id: addressId,
      contact_id: contactId,
    };
    const result = await this.addressService.get(user, request);
    return {
      data: result,
    };
  }
  @Put('/:addressId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.id = addressId;
    request.contact_id = contactId;
    const result = await this.addressService.update(user, request);
    return {
      data: result,
    };
  }
  @Delete('/:addressId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
  ): Promise<WebResponse<boolean>> {
    const request: RemoveAddressRequest = {
      address_id: addressId,
      contact_id: contactId,
    };
    await this.addressService.remove(user, request);
    return {
      data: true,
    };
  }
  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Param('contactId') contactId: string,
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);
    return {
      data: result,
    };
  }
}
