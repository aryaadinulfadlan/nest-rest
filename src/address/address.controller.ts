import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { Auth } from '../common/auth.decorator';
import { AddressResponse, CreateAddressRequest } from '../model/address.model';
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
}
