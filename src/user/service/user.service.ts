import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INewUser } from '../interface/INewUser';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(newUser: INewUser): Promise<UserDocument> {
    const user = new this.userModel(newUser);
    return user.save();
  }

  findAll(): Promise<Array<UserDocument>> {
    return this.userModel.find().exec();
  }

  findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }
}
