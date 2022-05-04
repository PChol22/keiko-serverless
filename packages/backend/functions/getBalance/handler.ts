import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });

export const main = async (event: {
  pathParameters: { userId: number };
}): Promise<any> => {
  const userId = event.pathParameters.userId;

  const params = {
    TableName: process.env.NFT_TABLE_NAME,
    ExpressionAttributeValues: {
      ':pk': { S: 'User' },
      ':sk': { S: userId.toString() },
    },
    KeyConditionExpression: 'PK = :pk and SK = :sk',
  };

  const { Items = [] as any } = await client.send(new QueryCommand(params));
  if (Items.length === 0) return { balance: 0, userId };
  return { balance: unmarshall(Items[0])['balance'], userId };
};
