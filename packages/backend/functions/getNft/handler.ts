import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });

export const main = async (event: {
  pathParameters: { userId: number };
}): Promise<any> => {
  const owner = event.pathParameters.userId;

  const params = {
    TableName: process.env.NFT_TABLE_NAME,
    ExpressionAttributeValues: {
      ':pk': { S: 'Nft' },
      ':owner': { S: owner.toString() },
    },
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :owner)',
  };

  const { Items = [] as any } = await client.send(new QueryCommand(params));

  return {
    balance: 1000,
    nftsList: Items.map(unmarshall),
  };
};
