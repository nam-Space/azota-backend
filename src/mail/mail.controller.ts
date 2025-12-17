import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { GenerateTokenPasswordDto } from './dto/create-mail.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('/generate-token-password')
  @ResponseMessage('Generate token password')
  async generateTokenPassword(
    @Body() generateTokenPasswordDto: GenerateTokenPasswordDto,
  ) {
    return await this.mailService.generateTokenPassword(
      generateTokenPasswordDto,
    );
  }
}
