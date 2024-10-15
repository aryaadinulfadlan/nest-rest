import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: { username: 'test' },
    });
  }
  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('testae', 10),
        token: 'token test',
      },
    });
  }
  async getUser(): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: {
        username: 'test',
      },
    });
  }
  async deleteContact() {
    await this.prismaService.contact.deleteMany({});
  }
  async getContact(): Promise<Contact> {
    return await this.prismaService.contact.findFirst({
      where: {
        first_name: 'test',
      },
    });
  }
  async createContact() {
    const currentUser = await this.getUser();
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'testa',
        email: 'test@test.com',
        phone: '9090',
        user_id: currentUser.id,
      },
    });
  }
  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          first_name: 'test',
        },
      },
    });
  }
}
