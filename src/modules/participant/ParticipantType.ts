import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import UserType from '../user/UserType';
import { UserLoader } from '../../loader';

const ParticipantType = registerType(
  new GraphQLObjectType({
    name: 'Participant',
    description: 'Participant type definition',
    fields: () => ({
      id: globalIdField('Participant'),
      _id: {
        type: GraphQLString,
        resolve: participant => participant._id,
      },
      participant: {
        type: UserType,
        description: 'Participant',
        resolve: ({ participant }, args, context) => UserLoader.load(context, participant),
      },
      total: {
        type: GraphQLFloat,
        description: 'Value to contribute',
        resolve: participant => participant.total,
      },
      active: {
        type: GraphQLBoolean,
        description: 'Active of the participant',
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export const ParticipantConnection = connectionDefinitions({
  name: 'Participant',
  nodeType: GraphQLNonNull(ParticipantType),
});

export default ParticipantType;
