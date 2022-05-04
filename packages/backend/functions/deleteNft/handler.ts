import { NFTEntity } from 'libs/dynamodb-toolbox/nftEntity';

export const main = async (event: {
  pathParameters: { id: string };
  queryStringParameters: { owner: string };
}): Promise<{ balance: number }> => {
  const nftId = event.pathParameters.id;
  const owner = event.queryStringParameters.owner;
  const item = {
    id: `${owner}/${nftId}`,
  };
  await NFTEntity.delete(item);
  return {
    balance: 1000,
  };
};
