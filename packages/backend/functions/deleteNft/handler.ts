import { NFTEntity } from 'libs/dynamodb-toolbox/nftEntity';

export const main = async (event: {
  pathParameters: { id: string };
}): Promise<{ balance: number }> => {
  const item = {
    id: event.pathParameters.id,
  };
  await NFTEntity.delete(item);
  return {
    balance: 1000,
  };
};
