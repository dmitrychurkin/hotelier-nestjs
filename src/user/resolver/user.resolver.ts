import { genSalt, hash, compare } from 'bcrypt';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserSignUpInput } from '../dto/user-signup.input';
import { User } from '../model/user.model';
import { UserService } from '../service/user.service';
import { ConfigService } from '@nestjs/config';
import { IGqlContext } from '../../interface/IGqlContext';
import { AuthService } from '../../auth/service/auth.service';
import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { ISignedUser } from '../interface/ISingedUser';
import { UserSignInInput } from '../dto/user-signin.input';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [User])
  users(): Promise<Array<User>> {
    return this.userService.findAll();
  }

  @Mutation(() => Boolean)
  async signUp(
    @Context() context: IGqlContext,
    @Args('newUserInputData') { password, name, email }: UserSignUpInput,
  ): Promise<true> {
    try {
      const salt = await genSalt(
        Number.parseInt(this.configService.get<string>('password.salt')),
      );
      const passwordHash = await hash(password, salt);

      const result = await this.userService.create({
        name,
        email,
        password: passwordHash,
      });

      await this.authService.signAndSetTokensIntoHeader(
        {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
        },
        context.res,
      );
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }

    return true;
  }

  @Mutation(() => Boolean)
  async signIn(
    @Context() context: IGqlContext,
    @Args('existedUserInputData') { password, email }: UserSignInInput,
  ): Promise<true> {
    try {
      const userDoc = await this.userService.findOneByEmail(email);

      if (!userDoc?.password) {
        throw new BadRequestException('User or password not found');
      }

      const isPasswordValid = await compare(password, userDoc.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Password mismatch');
      }
      await this.authService.signAndSetTokensIntoHeader(
        {
          id: userDoc.id,
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
        },
        context.res,
      );
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async signOut(@CurrentUser() user: ISignedUser): Promise<boolean> {
    try {
      const refreshTokenDocument = await this.authService.deleteRefreshToken(
        user.tokenId,
      );

      if (refreshTokenDocument) {
        return true;
      }
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
    return false;
  }
}
