import { GraphQLBoolean, GraphQLString, GraphQLID, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId, toGlobalId, fromGlobalId } from 'graphql-relay';

import ParticipantModel from '../ParticipantModel';

import ParticipantLoader from '../ParticipantLoader';
import { ParticipantConnection } from '../ParticipantType';

const mutation = mutationWithClientMutationId({
  name: 'ParticipantAdd',
  inputFields: {
    participant: {
      type: GraphQLID,
      description: 'User id',
    },
    total: {
      type: GraphQLFloat,
      description: 'Total contribution',
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { participant, total, active } = args;

    const newParticipant = await new ParticipantModel({
      participant: fromGlobalId(participant).id,
      total,
      active,
    }).save();

    return {
      participant: newParticipant,
      error: null,
    };
  },
  outputFields: {
    participantEdge: {
      type: ParticipantConnection.edgeType,
      resolve: ({ participant }) => {
        const node = new ParticipantLoader(participant);
        return {
          cursor: toGlobalId('Participant', participant.id),
          node,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
