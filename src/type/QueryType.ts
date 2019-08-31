

import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/user/UserType';
import BarbecueType, { BarbecueConnection } from '../modules/barbecue/BarbecueType';
import ParticipantType, { ParticipantConnection } from '../modules/participant/ParticipantType';
import { nodeField } from '../interface/NodeInterface';
import { UserLoader, BarbecueLoader, ParticipantLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    barbecue: {
      type: BarbecueType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, { id }, context) => BarbecueLoader.load(context, fromGlobalId(id).id),
    },
    barbecues: {
      type: BarbecueConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => BarbecueLoader.loadBarbecues(context, args),
    },
    participant: {
      type: ParticipantType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, { id }, context) => ParticipantLoader.load(context, fromGlobalId(id).id),
    },
    participants: {
      type: ParticipantConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
        barbecueIdArgs: {
          type: GraphQLID,
        },
      },
      resolve: (obj, args, context) => ParticipantLoader.loadParticipants(context, args),
    },
  }),
});
