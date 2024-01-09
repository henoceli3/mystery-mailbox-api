import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

@Injectable()
export class GlobalUtilityService {
  async sentMail(mailOptions: Options) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.STMP_USER,
        pass: process.env.STMP_PASS,
      },
    });
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
