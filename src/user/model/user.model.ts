import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field({
    description: `User's name`,
  })
  readonly name: string;

  @Field({
    description: `User's email`,
  })
  readonly email: string;
}
