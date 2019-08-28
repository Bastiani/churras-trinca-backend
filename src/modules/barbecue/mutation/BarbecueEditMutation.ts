import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import * as BarbecueLoader from '../BarbecueLoader';
import BarbecueType from '../BarbecueType';
import BarbecueModel from '../BarbecueModel';

const mutation = mutationWithClientMutationId({
  name: 'BarbecueEdit',
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
    participants: {
      type: GraphQLList(GraphQLID),
      description: "List of Global ID's of the participants that will be attached",
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { id, date, description, observation, participants, active } = args;

    const barbecue = await BarbecueModel.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!barbecue) {
      return {
        error: 'Churrasco inválido',
      };
    }

    // Edit record
    await barbecue.update({ date, description, observation, participants, active });

    // Clear dataloader cache
    BarbecueLoader.clearCache(context, barbecue._id);

    return {
      id: barbecue._id,
      error: null,
    };
  },
  outputFields: {
    barbecue: {
      type: BarbecueType,
      resolve: async ({ id }, args, context) => {
        const newBarbecue = await BarbecueLoader.load(context, id);

        if (!newBarbecue) {
          return null;
        }

        return newBarbecue;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
