import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { Topic } from '../entity/topic.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicInput, DeleteTopicInput, UpdateTopicInput } from '../dto/create-topic.input';
import { SearchTopicAdminInput, SearchTopicInput } from '../dto/search-topic.input';
import { TopicPage } from '../dto/topic-page';

@Injectable()
export class TopicService  {
    constructor(
        @InjectRepository(Topic)
        private repository: Repository<Topic>,
    ) { }

    async create(data: CreateTopicInput): Promise<DefaultMessage> {
        try {
            const create = this.repository.create(data);
            const savedAdmin = await this.repository.save(create);
            return new DefaultMessage(200, 'Topico criado com sucesso!');
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao cadastrar Topico!');
        }
    }

    async update(data: UpdateTopicInput): Promise<DefaultMessage> {
        try {
            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Topico não encontrado.');
            }

            await this.repository.update(getOne.id, {
                title: data.title ? data.title : getOne.title,
                link: data.link ? data.link : getOne.link,
            });

            return new DefaultMessage(200, 'Topico editado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao edtitar Topico!');
        }
    }

    async delete(data: DeleteTopicInput): Promise<DefaultMessage> {
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

    async byId(id: string): Promise<Topic> {
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

    async search(data: SearchTopicAdminInput): Promise<TopicPage> {
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
            throw new InternalServerErrorException('Falha ao retornar Topico paginados!');
        }
    }

}
