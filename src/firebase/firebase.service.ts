import { Injectable } from '@nestjs/common';
import { App, cert, initializeApp } from 'firebase-admin/app';
import {
  Messaging,
  TokenMessage,
  getMessaging,
} from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  private serviceAccount = require('../../mysterymailbox-firebase-adminsdk-vlkop-7cc4142eaf.json');
  private refreshTokenPathOrObject = require('../../client_secret_421862875738-phvu5q8bptgrj3aarc6l233vtmtrnn7t.apps.googleusercontent.com.json');
  private app: App;
  private messaging: Messaging;
  constructor() {
    this.app = initializeApp({
      credential: cert(this.serviceAccount),
      databaseURL: 'https://mysterymailbox-default-rtdb.firebaseio.com',
    });
    this.messaging = getMessaging(this.app);
  }

  async sendMessage(
    registrationTokens: string,
    uuid: string,
    body: string,
    dateOfReception: Date,
  ) {
    try {
      const message: TokenMessage = {
        data: {
          uuid: uuid,
          body: body,
          fromOtherUser: true.toString(),
          dateOfReception: dateOfReception.toISOString(),
        },
        notification: {
          title: 'Vous avez un nouveau message',
          body: 'Cliquez ici pour voir le message',
        },
        token: registrationTokens,
      };
      return await this.messaging.send(message);
    } catch (error) {
      console.log(error);
    }
  }
}
