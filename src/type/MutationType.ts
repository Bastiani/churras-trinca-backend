

import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutation';
import BarbecueMutations from '../modules/barbecue/mutation';
import ParticipantMutations from '../modules/participant/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...BarbecueMutations,
    ...ParticipantMutations,
  }),
});
