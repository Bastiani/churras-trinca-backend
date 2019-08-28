import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import * as ParticipantLoader from '../ParticipantLoader';
import ParticipantType from '../ParticipantType';
import ParticipantModel from '../ParticipantModel';

const mutation = mutationWithClientMutationId({
  name: 'ParticipantEdit',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    date: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    observation: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { id, date, description, observation, active } = args;

    const participant = await ParticipantModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!participant) {
      return {
        error: 'Participante é inválido',
      };
    }

    // Edit record
    await participant.update({ date, description, observation, active });

    // Clear dataloader cache
    ParticipantLoader.clearCache(context, participant._id);

    return {
      id: participant._id,
      error: null,
    };
  },
  outputFields: {
    participant: {
      type: ParticipantType,
      resolve: async ({ id }, args, context) => {
        const newParticipant = await ParticipantLoader.load(context, id);

        if (!newParticipant) {
          return null;
        }

        return newParticipant;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
