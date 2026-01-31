import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { Topic, TopicStatus } from '../entity/topic.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTopicInput, DeleteTopicInput, ReportTopicInput, UpdateTopicInput } from '../dto/create-topic.input';
import { SearchTopicAdminInput, SearchTopicInput } from '../dto/search-topic.input';
import { TopicPage } from '../dto/topic-page';
import { CommentStatus } from 'src/comments/entity/comments.entity';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private repository: Repository<Topic>,
    ) { }

    async create(data: CreateTopicInput): Promise<DefaultMessage> {
        try {
            const create = this.repository.create(data);
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

    async report(data: ReportTopicInput): Promise<DefaultMessage> {
        try {

            const getOne = await this.repository
                .createQueryBuilder()
                .update()
                .set({
                    status: TopicStatus.REPORTED,
                })
                .set({
                    reportCount: () => '"reportCount" + 1',
                })
                .where('id = :id', { id: data.id })
                .execute();

            if (!getOne) {
                throw new NotFoundException('Tópico não encontrado.');
            }

            return new DefaultMessage(200, 'Tópico reportado com sucesso');

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao reportar Tópico!');
        }
    }

    async byId(id: string): Promise<Topic> {
        try {
            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: id })
                .leftJoinAndSelect('query.comments', 'comments')
                .andWhere('comments.status != status:', { status: CommentStatus.REPORTED })
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

    async search(data: SearchTopicAdminInput): Promise<TopicPage> {
        try {
            const query = this.repository.createQueryBuilder('query')
                .where('query.status != :status', { status: TopicStatus.REPORTED })
                .andWhere('query.deletedAt IS NULL')

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

    async update(data: UpdateTopicInput): Promise<DefaultMessage> {
        try {
            const getOne = await this.repository.createQueryBuilder('query')
                .where('query.id = :id', { id: data.id })
                .getOne();

            if (!getOne) {
                throw new NotFoundException('Tópico não encontrado.');
            }

            await this.repository.update(getOne.id, {
                title: data.title ? data.title : getOne.title,
                link: data.link ? data.link : getOne.link,
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

    async delete(data: DeleteTopicInput): Promise<DefaultMessage> {
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

}
