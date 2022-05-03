import { NFTEntity } from 'libs/dynamodb-toolbox/nftEntity';

export const main = async (event: {
  pathParameters: { id: string };
}): Promise<string> => {
  const item = {
    id: event.pathParameters.id,
  };
  return NFTEntity.delete(item);
};
