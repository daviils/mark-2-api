import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminResolver } from './user-admin.resolver';

describe('UserAdminResolver', () => {
  let resolver: UserAdminResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAdminResolver],
    }).compile();

    resolver = module.get<UserAdminResolver>(UserAdminResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
