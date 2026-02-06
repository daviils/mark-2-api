import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entity/comments.entity';
import { DefaultMessage } from 'src/common/default-message';
import { Repository } from 'typeorm';
import {
  CreateReplyInput,
  DeleteReplyInput,
  ReportReplyInput,
  UpdateReplyInput,
} from '../dto/create-reply.input';
import { Reply, ReplyStatus } from '../entity/reply.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private repository: Repository<Reply>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  async create(data: CreateReplyInput): Promise<DefaultMessage> {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id: data.commentId },
      });
      if (!comment) {
        throw new NotFoundException('Comentário não encontrado!');
      }

      const created = this.repository.create({
        content: data.content,
        createdBy: data.createdBy,
        comment,
      });
      await this.repository.save(created);
      return new DefaultMessage(200, 'Resposta criada com sucesso!');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao cadastrar Resposta!');
    }
  }

  async report(data: ReportReplyInput): Promise<DefaultMessage> {
    try {
      const result = await this.repository
        .createQueryBuilder()
        .update()
        .set({
          status: ReplyStatus.REPORTED,
        })
        .set({
          reportCount: () => '"reportCount" + 1',
        })
        .where('id = :id', { id: data.id })
        .execute();

      if (!result) {
        throw new NotFoundException('Resposta não encontrada.');
      }

      return new DefaultMessage(200, 'Resposta reportada com sucesso');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao reportar Resposta!');
    }
  }

  async update(data: UpdateReplyInput): Promise<DefaultMessage> {
    try {
      const existing = await this.repository
        .createQueryBuilder('query')
        .where('query.id = :id', { id: data.id })
        .andWhere('query.deletedAt IS NULL')
        .getOne();

      if (!existing) {
        throw new NotFoundException('Resposta não encontrada.');
      }

      await this.repository.update(existing.id, {
        content: data.content ? data.content : existing.content,
      });

      return new DefaultMessage(200, 'Resposta editada com sucesso');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao editar Resposta!');
    }
  }

  async delete(data: DeleteReplyInput): Promise<DefaultMessage> {
    try {
      const existing = await this.repository
        .createQueryBuilder('query')
        .where('query.id = :id', { id: data.id })
        .andWhere('query.deletedAt IS NULL')
        .getOne();

      if (!existing) {
        throw new NotFoundException('Resposta não encontrada.');
      }

      await this.repository.softDelete(existing.id);
      return new DefaultMessage(200, 'Resposta deletada com sucesso');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao deletar Resposta!');
    }
  }

  async byId(id: string): Promise<Reply> {
    try {
      const reply = await this.repository
        .createQueryBuilder('reply')
        .where('reply.id = :id', { id })
        .andWhere('reply.deletedAt IS NULL')
        .leftJoinAndSelect('reply.comment', 'comment')
        .getOne();

      if (!reply) {
        throw new NotFoundException('Resposta não encontrada.');
      }

      return reply;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao encontrar Resposta!');
    }
  }

  async byCommentId(commentId: string): Promise<Reply[]> {
    try {
      return this.repository
        .createQueryBuilder('reply')
        .where('reply.deletedAt IS NULL')
        .leftJoin('reply.comment', 'comment')
        .andWhere('comment.id = :commentId', { commentId })
        .orderBy('reply.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      console.error('Erro inesperado: ', error);
      throw new InternalServerErrorException('Falha ao listar Respostas!');
    }
  }
}

