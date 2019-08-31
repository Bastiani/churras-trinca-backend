import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';

import { globalIdField, connectionArgs } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import { ParticipantConnection } from '../participant/ParticipantType';
import { ParticipantLoader } from '../../loader';

const BarbecueType = registerType(
  new GraphQLObjectType({
    name: 'Barbecue',
    description: 'Barbecue type definition',
    fields: () => ({
      id: globalIdField('Barbecue', barbecue => barbecue._id),
      _id: {
        type: GraphQLString,
        resolve: barbecue => barbecue._id,
      },
      date: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Date of the barbecue',
        resolve: obj => (obj.date ? obj.date.toISOString() : null),
      },
      description: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Description of the barbecue',
      },
      observation: {
        type: GraphQLString,
        description: 'Observation of the barbecue',
      },
      participants: {
        type: GraphQLNonNull(ParticipantConnection.connectionType),
        args: {
          ...connectionArgs,
        },
        resolve: async ({ _id }, args, context) => ParticipantLoader.loadParticipants(context, args, _id),
      },
      total: {
        type: GraphQLFloat,
        description: 'Total',
        resolve: async ({ _id }, args, context) => ParticipantLoader.loadParticipantsTotal(context, args, _id),
      },
      active: {
        type: GraphQLBoolean,
        description: 'Active of the barbecue',
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export const BarbecueConnection = connectionDefinitions({
  name: 'Barbecue',
  nodeType: GraphQLNonNull(BarbecueType),
});

export default BarbecueType;
