import { BadRequestException, Controller, HttpCode, HttpStatus, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { VideosService } from '../service/videos.service';
import { Multer } from 'multer';


@Controller('videos')
export class VideosController {

    constructor(
        private readonly service: VideosService,
        private readonly jwtService: JwtService,
    ) {
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('import-video/excel')
    // @ApiOperation({ description: 'Import Excel' })
    // @HttpCode(HttpStatus.OK)
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     required: true,
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             file: {
    //                 type: 'string',
    //                 format: 'binary',

    //             },
    //         },
    //     },
    // })
    // @UseInterceptors(FileInterceptor('file', {
    //     limits: {
    //         fieldSize: 5,
    //     },
    //     fileFilter: (req: any, file: any, cb: any) => {
    //         if (!file.mimetype.match(/\/(vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
    //             cb(new BadRequestException(`Unsupported file type ${file.mimetype}`), false);
    //         }
    //         cb(null, true);
    //     },
    // }))
    // async importExcel(
    //     @UploadedFile(Multer.ParseFile) file: Multer.File,
    //     @Req() req: any,
    // ) {
    //     return await this.service.importExcel(file);
    // }
}
