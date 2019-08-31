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
import BarbecueType from '../barbecue/BarbecueType';
import { UserLoader, BarbecueLoader } from '../../loader';

const ParticipantType = registerType(
  new GraphQLObjectType({
    name: 'Participant',
    description: 'Participant type definition',
    fields: () => ({
      id: globalIdField('Participant', participant => participant._id),
      _id: {
        type: GraphQLString,
        resolve: participant => participant._id,
      },
      participant: {
        type: UserType,
        description: 'Participant',
        resolve: ({ participant }, args, context) => UserLoader.load(context, participant),
      },
      barbecue: {
        type: BarbecueType,
        description: 'Barbecue',
        resolve: ({ barbecue }, args, context) => BarbecueLoader.load(context, barbecue),
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
