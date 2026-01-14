import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { VideosModule } from './videos/videos.module';
import { UserAdminModule } from './user-admin/user-admin.module';
import { AuthModule } from './auth/auth.module';
import { TopicModule } from './topic/topic.module';

@Module({
	imports: [

		ConfigModule.forRoot({
			isGlobal: true, // torna disponível em toda a aplicação
			envFilePath: '.env', // opcional se o .env está na raiz
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('DB_HOST'),
				port: parseInt(configService.get<string>('DB_PORT')!, 10),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_DATABASE'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: true,
				logging: false,
				autoLoadEntities: true
			}),
		}),
		UserModule,
		VideosModule,
		UserAdminModule,
		AuthModule,
		TopicModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
