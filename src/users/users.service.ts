import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { GlobalUtilityService } from 'src/global-utility/global-utility.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly globalUtilityService: GlobalUtilityService,
  ) {}

  /**
   * Creates a new user with the given information.
   *
   * @param {string} userName - The username of the user.
   * @param {string} email - The email address of the user.
   * @param {string} deviceToken - The device token of the user.
   * @returns {Promise<{message: string, data: {userName: string}}>} - An object with a message and the created user's username.
   */
  async v1_create(
    userName: string,
    email: string,
    deviceToken: string,
  ): Promise<{ message: string; data: { userName: string } }> {
    const existUser = await this.usersRepository.exist({
      where: { userName: userName, email: email },
    });
    if (existUser) {
      throw new BadRequestException(`${userName} est déjà utilisé`);
    }
    await this.usersRepository.save({
      uuid: uuidv4(),
      userName: userName.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      isActive: true,
      termOfUs: true,
      deviceToken: deviceToken,
      created_at: new Date(),
    });
    await this.globalUtilityService.sentMail({
      from: 'Mystery Mailbox <helitako16@gmail.com>',
      to: email,
      subject: 'Inscription Mystery Mailbox',
      text: 'Bienvenue sur Mystery Mailbox',
    });
    return {
      message: 'User Created',
      data: {
        userName: userName,
      },
    };
  }

  /**
   * Checks if a given username exists in the user repository.
   *
   * @param {string} userName - The username to check.
   * @return {Promise<{ message: string, data: { existUser: boolean } }>} - A promise that resolves to an object containing a message and data.
   */
  async checkUserName(
    userName: string,
  ): Promise<{ message: string; data: { existUser: boolean } }> {
    const existUser = await this.usersRepository.exist({
      where: { userName: userName },
    });
    return {
      message: existUser ? 'User Exist' : 'User does not exist',
      data: { existUser: existUser },
    };
  }

  /**
   * Deletes a user.
   *
   * @param {string} userName - The username of the user to be deleted.
   * @return {object} - An object containing a message and an empty data object.
   */
  async delete(userName: string): Promise<{ message: string; data: null }> {
    await this.usersRepository.update(
      { userName: userName },
      { isActive: false },
    );
    return {
      message: 'User Deleted',
      data: null,
    };
  }
}
