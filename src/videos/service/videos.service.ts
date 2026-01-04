import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { Videos } from '../entity/videos.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoInput, DeleteVideoInput, UpdateVideoInput } from '../dto/create-video.input';
import { DefaultMessage } from 'src/common/default-message';
import { VideoPage } from '../dto/video-page';
import { SearchVideoInput } from '../dto/search-video.input';
import moment from 'moment';
import { ImportVideoInput } from '../dto/import-video.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';


const excel = require('exceljs');

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Videos)
        private repository: Repository<Videos>,
    ) { }

    async create(data: CreateVideoInput): Promise<DefaultMessage> {
        try {
            const create = this.repository.create(data);
            const savedAdmin = await this.repository.save(create);
            return new DefaultMessage(200, 'Video criado com sucesso!');
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao cadastrar video!');
        }
    }

    async update(data: UpdateVideoInput): Promise<DefaultMessage> {
        try {
            const getOne = await this.repository.createQueryBuilder('user')
                .where('user.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Video não encontrado.');
            }

            await this.repository.update(getOne.id, {
                title: data.title ? data.title : getOne.title,
                description: data.description ? data.description : getOne.description,
                thumb: data.thumb ? data.thumb : getOne.thumb,
                urlExternal: data.urlExternal ? data.urlExternal : getOne.urlExternal,
                site: data.site ? data.site : getOne.site,
                tags: data.tags ? data.tags : getOne.tags,
            });

            return new DefaultMessage(200, 'Video editado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao edtitar video!');
        }
    }

    async delete(data: DeleteVideoInput): Promise<DefaultMessage> {
        try {

            const getOne = await this.repository.createQueryBuilder('user')
                .where('user.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Video não encontrado.');
            }

            await this.repository.softDelete(getOne.id);

            return new DefaultMessage(200, 'Video deletado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao deletar video!');
        }
    }

    async byId(id: string): Promise<Videos> {
        try {
            const getOne = await this.repository.createQueryBuilder('user')
                .where('user.id = :id', { id: id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Video não encontrado.');
            }
            return getOne;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao encotrar video!');
        }
    }

    async list(): Promise<Videos[]> {
        try {
            const getMany = await this.repository.createQueryBuilder('user')
                .where('user.deletedAt IS NULL')
                .getMany();

            return getMany;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao listar video!');
        }
    }

    async search(data: SearchVideoInput): Promise<VideoPage> {
        try {
            const query = this.repository.createQueryBuilder('videos')
                .where('videos.deletedAt IS NULL')

            if (typeof data.keyword !== 'undefined' && data.keyword) {
                query.andWhere(
                    new Brackets((subQb) => {
                        subQb.andWhere('videos.title like :keyword', {
                            keyword: `%${data.keyword}%`,
                        });
                        subQb.orWhere('videos.tags like :keyword', {
                            keyword: `%${data.keyword}%`,
                        });
                    }),
                );
            }

            if (typeof data.start !== 'undefined' && data.start)
                query.andWhere('videos.createdAt >= :start', { start: data.start });

            if (typeof data.end !== 'undefined' && data.end)
                query.andWhere('videos.createdAt <= :end', { end: data.end });

            const currentPage = data.page;
            if (data.page == null || data.page < 1) data.page = 1;
            const totalCount = await query.getCount();
            const pageSize = 10;
            const totalPage = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;
            const previousPage = data.page > 1;
            const nextPage = (currentPage ?? 1) < totalPage;

            const userCustomers = await query
                .skip((data.page - 1) * pageSize)
                .take(pageSize)
                .getMany();

            return {
                pageSize: pageSize,
                currentPage: currentPage ?? 1,
                totalPage: totalPage,
                previousPage: previousPage,
                nextPage: nextPage,
                totalCount: totalCount,
                results: userCustomers,
            };

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }

            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao retornar Cliente paginados!');
        }
    }

    async importExcel(file: Multer.File) {
        const workbook = new excel.Workbook();
        await workbook.xlsx.load(file.buffer);

        const rows = workbook.worksheets[0].getRows(2, workbook.worksheets[0].actualRowCount - 1);
        if (!rows) throw new BadRequestException('O arquivo precisa ter ao menos um usuário');

        const users: ImportVideoInput[] = [];
        const normalizeTime = (raw: any): string | null => {
            if (raw === null || raw === undefined || raw === '') return null;

            // se vier como Date do Excel
            if (raw instanceof Date) {
                // pega só hora:min:seg
                return moment(raw).utc().format('HH:mm:ss');
            }

            const str = String(raw).trim();

            // exigir formato hh:mm:ss
            const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!regex.test(str)) {
                throw new BadRequestException(`Hora inválida: "${str}". Use o formato HH:mm:ss`);
            }

            return str;
        };
        rows.forEach((row) => {
            const user = new ImportVideoInput();
            if (row.values[1].indexOf('\'') != -1)
                throw new BadRequestException('Carácter inválido (\')');

            user.title = row.values[1];
            user.description = row.values[2];
            user.thumb = row.values[3];
            user.urlExternal = row.values[4];
            user.site = row.values[5];
            user.tags = row.values[6];

            // valida relação start/end
            // if (start && end) {
            //     // compara como string porque está em HH:mm:ss
            //     if (start > end) {
            //         throw new BadRequestException(
            //             `Hora inicial (${start}) não pode ser maior que hora final (${end})`
            //         );
            //     }
            // }

            users.push(user);
        });
        // const response = await this.createMultipleUsers(users);

        return new DefaultMessage(200, 'Usuários cadastrados com sucesso!');
    }
}
