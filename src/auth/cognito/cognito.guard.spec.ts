import { CognitoGuard } from './cognito.guard';

describe('CognitoGuard', () => {
  it('should be defined', () => {
    expect(new CognitoGuard()).toBeDefined();
  });
});
