import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) { }

	async createUser(data: CreateUserInput): Promise<User> {
		try {
			const verifyPhone = await this.userRepository.findOne({
				where: {
					phone: data.phone,
				}
			});

			if (verifyPhone)
				throw new BadRequestException('Telefone já está em uso.');


			const userAdmin = this.userRepository.create(data);
			userAdmin.status = 'pendingAdress';
			const savedAdmin = await this.userRepository.save(userAdmin);
			return savedAdmin;
		} catch (error) {
			if (error instanceof BadRequestException || error instanceof NotFoundException) {
				throw error;
			}
			console.error('Erro inesperado: ', error);
			throw new InternalServerErrorException('Falha ao criar conta do cliente!');
		}
	}

	async findOneById(id: string): Promise<User> {
		try {
			const user = await this.userRepository.createQueryBuilder('user')
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

	async findAllUser(): Promise<User[]> {
		try {
			const user = await this.userRepository.createQueryBuilder('user')
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

