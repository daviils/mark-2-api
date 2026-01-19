import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Comments } from '../entity/comments.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentsInput, DeleteCommentsInput, UpdateCommentsInput } from '../dto/create-comments.input';
import { DefaultMessage } from 'src/common/default-message';
import { CommentsPage } from '../dto/comments-page';
import { SearchCommentsAdminInput } from '../dto/search-comments.input';
import { Topic } from 'src/topic/entity/topic.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments)
        private repository: Repository<Comments>,
        @InjectRepository(Topic)
        private repositoryTopic: Repository<Topic>,
    ) { }

    async create(data: CreateCommentsInput): Promise<DefaultMessage> {
        try {

            const topic = await this.repositoryTopic.findOne({ where: { id: data.topicId } });
            if (!topic) {
                throw new NotFoundException('Tópico não encontrado!');
            }

            const create = this.repository.create({ ...data, topic });
            const savedAdmin = await this.repository.save(create);
            return new DefaultMessage(200, 'Tópico criado com sucesso!');
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao cadastrar Tópico!');
        }
    }

    async update(data: UpdateCommentsInput): Promise<DefaultMessage> {
        try {
            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Tópico não encontrado.');
            }

            await this.repository.update(getOne.id, {
                title: data.title ? data.title : getOne.title,
            });

            return new DefaultMessage(200, 'Tópico editado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao edtitar Tópico!');
        }
    }

    async delete(data: DeleteCommentsInput): Promise<DefaultMessage> {
        try {

            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Tópico não encontrado.');
            }

            await this.repository.softDelete(getOne.id);

            return new DefaultMessage(200, 'Tópico deletado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao deletar Tópico!');
        }
    }

    async byId(id: string): Promise<Comments> {
        try {
            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: id })
                .leftJoinAndSelect('query.comments', 'comments')
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Tópico não encontrado.');
            }
            return getOne;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao encotrar Tópico!');
        }
    }

    async search(data: SearchCommentsAdminInput): Promise<CommentsPage> {
        try {
            const query = this.repository.createQueryBuilder('query')
                .where('query.deletedAt IS NULL')

            if (typeof data.keyword !== 'undefined' && data.keyword) {
                query.andWhere(
                    new Brackets((subQb) => {
                        subQb.andWhere('query.title like :keyword', {
                            keyword: `%${data.keyword}%`,
                        });
                        subQb.orWhere('query.tags like :keyword', {
                            keyword: `%${data.keyword}%`,
                        });
                    }),
                );
            }

            if (typeof data.start !== 'undefined' && data.start)
                query.andWhere('query.createdAt >= :start', { start: data.start });

            if (typeof data.end !== 'undefined' && data.end)
                query.andWhere('query.createdAt <= :end', { end: data.end });

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
            throw new InternalServerErrorException('Falha ao retornar Tópico paginados!');
        }
    }
}
