

import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutation';
import BarbecueMutations from '../modules/barbecue/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...BarbecueMutations,
  }),
});
