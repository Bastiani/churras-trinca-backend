import { GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, toGlobalId, fromGlobalId } from 'graphql-relay';

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
      type: GraphQLNonNull(GraphQLString),
    },
    participants: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))),
      description: "List of Global ID's of the participants that will be attached",
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (args) => {
    const { date, description, observation, active } = args;
    const participants = args.participants.map((participant: string) => fromGlobalId(participant).id);

    const newBarbecue = await new BarbecueModel({
      date,
      description,
      observation,
      participants,
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
