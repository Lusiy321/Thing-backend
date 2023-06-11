/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: 'users' }]),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
