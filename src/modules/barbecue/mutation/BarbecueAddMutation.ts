import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import BarbecueModel from '../BarbecueModel';

import BarbecueLoader from '../BarbecueLoader';
import { BarbecueConnection } from '../BarbecueType';

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
      type: GraphQLString,
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
      barbecue: newBarbecue,
      error: null,
    };
  },
  outputFields: {
    barbecueEdge: {
      type: BarbecueConnection.edgeType,
      resolve: ({ barbecue }) => {
        const node = new BarbecueLoader(barbecue);
        return {
          cursor: toGlobalId('Barbecue', barbecue.id),
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
