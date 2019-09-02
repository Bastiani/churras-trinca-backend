import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import * as ParticipantLoader from '../ParticipantLoader';
import ParticipantType from '../ParticipantType';
import ParticipantModel from '../ParticipantModel';
import { removeEmptyFields } from '../../../core/removeEmptyFields';

const mutation = mutationWithClientMutationId({
  name: 'ParticipantEdit',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
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
    const { id, participant, barbecue, total, active } = args;

    if (!user) {
      return {
        error: 'Usuário não logado',
      };
    }

    const participantUpdate = await ParticipantModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!participantUpdate) {
      return {
        error: 'Participante é inválido',
      };
    }

    const payload = removeEmptyFields({ participant, barbecue, total, active });

    // Edit record
    await participantUpdate.update(payload);

    // Clear dataloader cache
    ParticipantLoader.clearCache(context, participantUpdate._id);

    return {
      id: participantUpdate.id,
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
