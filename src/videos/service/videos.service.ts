import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Videos } from '../entity/videos.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoInput } from '../dto/create-video.input';
import { DefaultMessage } from 'src/common/default-message';

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
}
