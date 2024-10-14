import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: { username: 'test' },
    });
  }
  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        email: 'test@mail.com',
      },
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
}
