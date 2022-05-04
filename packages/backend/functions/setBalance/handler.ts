import { UserEntity } from 'libs/dynamodb-toolbox/userEntity';

export const main = async (event: {
  pathParameters: { userId: string };
  queryStringParameters: { balance: string };
}): Promise<{ userId: string; balance: number }> => {
  const userId = event.pathParameters.userId;
  const balance = Number.isInteger(+event.queryStringParameters.balance)
    ? +event.queryStringParameters.balance
    : 0;
  const item = {
    userId,
    balance,
  };
  await UserEntity.put(item);
  return item;
};
