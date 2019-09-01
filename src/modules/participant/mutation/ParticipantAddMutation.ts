import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
} from 'graphql';
import {
  mutationWithClientMutationId,
  toGlobalId,
  fromGlobalId,
} from 'graphql-relay';

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
    barbecue: {
      type: GraphQLID,
      description: 'Barbecue id',
    },
    total: {
      type: GraphQLFloat,
      description: 'Total contribution',
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { user } = context;
    const { participant, barbecue, total, active } = args;

    const newUser = fromGlobalId(participant).id || user.id;

    const participantExist = await ParticipantModel.findOne({
      participant: newUser,
      barbecue: fromGlobalId(barbecue).id,
      active: true,
    });

    if (participantExist) {
      return {
        error: 'Participante já cadastrado',
      };
    }

    const newParticipant = await new ParticipantModel({
      participant: newUser,
      barbecue: fromGlobalId(barbecue).id,
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
