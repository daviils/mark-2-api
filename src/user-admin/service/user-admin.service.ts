import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserAdmin } from '../entity/user-admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefaultMessage } from 'src/common/default-message';
import { CreateUserAdminInput } from '../dto/create-user-admin.input';

@Injectable()
export class UserAdminService {
    constructor(
        @InjectRepository(UserAdmin)
        private repository: Repository<UserAdmin>,
    ) { }

    async create(data: CreateUserAdminInput): Promise<DefaultMessage> {
        try {
            const verifyEmail = await this.repository.findOne({
                where: { email: data.email }
            });

            if (verifyEmail)
                throw new BadRequestException('E-mail já está em uso.');


            const userAdmin = this.repository.create(data);
            await this.repository.save(userAdmin);
            return new DefaultMessage(200, 'Usuário Admin criado com sucesso!');
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao criar usuário admin!');
        }
    }

    async findOne(id: string): Promise<UserAdmin> {
        try {
            const user = await this.repository.createQueryBuilder('user')
                .where('user.id = :id', { id: id })
                .getOne();

            if (!user) {
                throw new NotFoundException('Usuário não encontrado.');
            }
            return user;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao criar conta do cliente!');
        }
    }

    async list(): Promise<UserAdmin[]> {
        try {
            const user = await this.repository.createQueryBuilder('user')
                .where('user.deletedAt IS NULL')
                .getMany();

            return user;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Erro inesperado: ', error);
            throw new InternalServerErrorException('Falha ao criar conta do cliente!');
        }
    }
}
