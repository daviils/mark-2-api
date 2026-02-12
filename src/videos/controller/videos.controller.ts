import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { DefaultMessage } from 'src/common/default-message';
import { CreateVideoInput, DeleteVideoInput, UpdateVideoInput } from '../dto/create-video.input';
import { SearchVideoInput } from '../dto/search-video.input';
import { VideoPage } from '../dto/video-page';
import { Videos } from '../entity/videos.entity';
import { VideosService } from '../service/videos.service';


@Controller('videos')
export class VideosController {

    constructor(private readonly service: VideosService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createVideo(@Body() input: CreateVideoInput): Promise<DefaultMessage> {
        return this.service.create(input);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateVideo(@Body() input: UpdateVideoInput): Promise<DefaultMessage> {
        return this.service.update(input);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteVideo(@Body() input: DeleteVideoInput): Promise<DefaultMessage> {
        return this.service.delete(input);
    }

    @Get()
    async listVideos(): Promise<Videos[]> {
        return this.service.list();
    }

    @UseGuards(JwtAuthGuard)
    @Post('search')
    async searchVideo(@Body() input: SearchVideoInput): Promise<VideoPage> {
        return this.service.search(input);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async byIdVideos(@Param('id') id: string): Promise<Videos> {
        return this.service.byId(id);
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
