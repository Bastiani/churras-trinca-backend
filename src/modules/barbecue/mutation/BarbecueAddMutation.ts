import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import BarbecueModel from '../BarbecueModel';

import * as BarbecueLoader from '../BarbecueLoader';
import BarbecueType from '../BarbecueType';

const mutation = mutationWithClientMutationId({
  name: 'BarbecueAdd',
  inputFields: {
    date: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    observation: {
      type: GraphQLNonNull(GraphQLString),
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { date, description, observation, active } = args;

    const newBarbecue = await new BarbecueModel({
      date,
      description,
      observation,
      active,
    }).save();

    return {
      id: newBarbecue._id,
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
