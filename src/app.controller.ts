import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/home')
  @Render('home')
  home() {
    return { name: 'David' };
  }

  @Get('/detail/:id')
  @Render('detail')
  detail(@Param('id') id: string) {
    return {
      item: { id },
    };
  }
}
