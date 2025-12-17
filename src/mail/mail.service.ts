import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { GenerateTokenPasswordDto } from './dto/create-mail.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async generateTokenPassword(
    generateTokenPasswordDto: GenerateTokenPasswordDto,
  ) {
    try {
      const { email, locale } = generateTokenPasswordDto;

      const passwordToken = uuidv4();

      const userDb = await this.userRepository.findOne({ where: { email } });

      if (!userDb) {
        throw new BadRequestException(`Email ${email} không tồn tại!`);
      }

      await this.userRepository.update(
        {
          email,
        },
        {
          passwordToken,
        },
      );

      await this.mailerService.sendMail({
        to: email,
        from: '"Support Team" <support@example.com>', // override default from
        subject: locale === 'vi' ? 'Đặt lại mật khẩu' : 'Reset password',
        template: 'change-password',
        context: {
          url: `http://${this.configService.get<string>('FRONT_END_URL')}`,
          email: email,
          localeVietnam: locale === 'vi',
          passwordToken,
        },
      });

      return {
        notification: 'Gửi email thành công!',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
