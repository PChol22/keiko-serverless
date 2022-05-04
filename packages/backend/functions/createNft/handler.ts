import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const intervalRandInt = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);

const client = new DynamoDBClient({ region: 'eu-west-1' });

interface NftPayload {
  balance: number;
  newNft: {
    id: string;
    positionX: number;
    positionY: number;
    imageIndex: number;
  } | null;
}

export const main = async (event: {
  pathParameters: { userId: number };
}): Promise<NftPayload> => {
  const id = randomUUID();
  const owner = event.pathParameters.userId;

  const newNft = {
    id,
    positionX: intervalRandInt(5, 90),
    positionY: intervalRandInt(10, 90),
    imageIndex: intervalRandInt(0, 4),
    owner,
  };

  const Item = {
    PK: { S: 'Nft' },
    SK: { S: `${owner}/${id}` },
    id: { S: id },
    positionX: { N: newNft.positionX.toString() },
    positionY: { N: newNft.positionY.toString() },
    imageIndex: { N: newNft.imageIndex.toString() },
  };
  const params = {
    TableName: process.env.NFT_TABLE_NAME,
    Item,
  };

  const nftPrice = Math.floor(Math.random() * 9000 + 1000);

  const balance = await fetch(
    `https://ujpufcmks4.execute-api.eu-west-1.amazonaws.com/balances/${owner}`,
  )
    .then(res => res.json())
    .then((result: { balance: number; userId: string }) => result.balance);

  if (nftPrice > balance) return { balance, newNft: null };

  const newBalance = balance - nftPrice;

  fetch(
    `https://ujpufcmks4.execute-api.eu-west-1.amazonaws.com/balances/${owner}?balance=${newBalance}`,
  );

  await client.send(new PutItemCommand(params));
  return {
    balance: 1000,
    newNft: newNft,
  };
};
