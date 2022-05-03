import { getHandlerPath } from 'libs/configHelper/getHandlerPath';
import { nftTableDynamoDBDeletePolicies } from 'resources/policies';

export const deleteNft = {
  handler: getHandlerPath(__dirname),
  iamRoleStatements: [nftTableDynamoDBDeletePolicies],
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/nfts/{id}',
      },
    },
  ],
};
