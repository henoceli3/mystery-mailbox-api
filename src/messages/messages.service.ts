import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MessagesEntity } from './messages.entity/messages.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from 'src/users/user.entity/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Creates a new message with the specified user name and message.
   *
   * @param {string} userName - The user name for the message.
   * @param {string} message - The content of the message.
   * @return {Promise<{message: string, data: {userName: string, uuid: string, message: string, created_at: Date}}>} - A promise that resolves to an object containing the created message details.
   */
  async v1_create(
    userName: string,
    message: string,
  ): Promise<{
    message: string;
    data: {
      userName: string;
      uuid: string;
      message: string;
      created_at: Date;
    };
  }> {
    try {
      const encodedMessage = encodeURIComponent(message); // encoder le message
      const createdMessage = await this.messagesRepository.save({
        uuid: uuidv4(),
        userName: userName.toLowerCase().trim(),
        read: false,
        message: encodedMessage,
        is_active: true,
        created_at: new Date(),
      }); // enregistrer le message

      return {
        message: 'Message Created',
        data: {
          userName: userName,
          uuid: createdMessage.uuid,
          message: message,
          created_at: createdMessage.created_at,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Hum ! Une erreur s'est produite");
    }
  }

  /**
   * Retrieves a portion of a message based on the specified length.
   *
   * @param {string} message - The original message.
   * @param {number} longueurPartie - The desired length of the portion.
   * @return {string} - The portion of the message.
   */
  async obtenirPartieMessage(
    message: string,
    longueurPartie: number,
  ): Promise<string> {
    if (message.length <= longueurPartie) {
      return message;
    } else {
      return `${message.substring(0, longueurPartie)}...`;
    }
  }

  /**
   * Find all messages by user name.
   *
   * @param {string} userName - The user name.
   * @return {Promise<object>} - An object containing the messages of the user.
   * @throws {BadRequestException} - If an error occurs.
   */
  async v1_findAllByUser(userName: string): Promise<object> {
    try {
      const messages = await this.messagesRepository.find({
        order: { created_at: 'DESC' },
        where: {
          userName: userName.toLocaleLowerCase().trim(),
          is_active: true,
        },
      });
      const decodedMessages = await Promise.all(
        messages.map(async (message) => {
          const title = await this.obtenirPartieMessage(
            decodeURI(message.message),
            30,
          );
          return {
            uuid: message.uuid,
            title: title,
            body: decodeURI(message.message),
            fromOtherUser: true,
            dateOfReception: message.created_at,
            read: message.read,
          };
        }),
      );
      return {
        message: `All messages of user @${userName}`,
        data: {
          userName: userName,
          messages: decodedMessages,
        },
      };
    } catch (error) {
      throw new BadRequestException("Hum! Une erreur s'est produite");
    }
  }

  /**
   * Marks a message as read.
   *
   * @param {string} uuid - The UUID of the message to mark as read.
   * @return {Promise<{message: string, data: {}}>} - A promise that resolves to an object with a message and an empty data object.
   * @throws {BadRequestException} - If an error occurs while marking the message as read.
   */
  async markMessageAsRead(
    uuid: string,
  ): Promise<{ message: string; data: object }> {
    try {
      await this.messagesRepository.update({ uuid: uuid }, { read: true });
      return {
        message: 'Message marked as read',
        data: {},
      };
    } catch (error) {
      throw new BadRequestException("Hum! Une erreur s'est produite");
    }
  }

  /**
   * Deletes a single message.
   *
   * @param {string} uuid - The UUID of the message to delete.
   * @return {Promise<{ message: string, data: {} }>} - An object containing a success message and an empty data object.
   * @throws {BadRequestException} - If an error occurs during the deletion process.
   */
  async deleteOneMessage(
    uuid: string,
  ): Promise<{ message: string; data: object }> {
    try {
      await this.messagesRepository.update(
        { uuid: uuid },
        { is_active: false, deleted_at: new Date() },
      );
      return {
        message: 'Message deleted',
        data: {},
      };
    } catch (error) {
      throw new BadRequestException("Hum! Une erreur s'est produite");
    }
  }

  /**
   * Deletes a list of messages.
   *
   * @param {string[]} uuids - An array of UUIDs representing the messages to be deleted.
   * @return {Promise<{ message: string, data: {} }>} - A promise that resolves to an object with a message and an empty data object.
   * @throws {BadRequestException} - If an error occurs during the deletion process.
   */
  async deleteMessageList(
    uuids: string[],
  ): Promise<{ message: string; data: object }> {
    try {
      await this.messagesRepository.update(
        { uuid: In(uuids) },
        { is_active: false, deleted_at: new Date() },
      );
      return {
        message: 'Messages deleted',
        data: {},
      };
    } catch (error) {
      throw new BadRequestException("Hum! Une erreur s'est produite");
    }
  }

  /**
   * Sends a message to a user via Firebase Cloud Messaging.
   *
   * @param {string} userName - The username of the recipient.
   * @param {string} messageUuid - The UUID of the message.
   * @param {string} message - The content of the message.
   * @param {Date} created_at - The timestamp when the message was created.
   * @return {Promise<{message: string, data: object}>} - A promise that resolves with an object containing a success message and additional data.
   */
  async v1_sendMessage(
    userName: string,
    messageUuid: string,
    message: string,
    created_at: Date,
  ): Promise<{
    message: string;
    data: object;
  }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { userName: userName },
        select: ['uuid', 'deviceToken'],
      });

      await this.firebaseService.sendMessage(
        user.deviceToken,
        messageUuid,
        message,
        created_at,
      );
      return {
        message: 'Message sent',
        data: {},
      };
    } catch (error) {
      throw new BadRequestException("Hum! Une erreur s'est produite");
    }
  }
}
