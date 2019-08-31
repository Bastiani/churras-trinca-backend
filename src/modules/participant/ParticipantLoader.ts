import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader
} from '@entria/graphql-mongoose-loader';
import mongoose, { Types } from 'mongoose';
import { ConnectionArguments, fromGlobalId } from 'graphql-relay';

import ParticipantModel, { IParticipant } from './ParticipantModel';
import { GraphQLContext } from '../../TypeDefinition';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Participant {
  id: string;
  _id: Types.ObjectId;
  participant: string;
  barbecue: string;
  total: number;
  active: boolean | null | undefined;

  constructor(data: IParticipant) {
    this.id = data.id;
    this._id = data._id;
    this.participant = data.participant;
    this.barbecue = data.barbecue;
    this.total = data.total;
    this.active = data.active;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(ParticipantModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: string | Object | ObjectId
): Promise<Participant | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.ParticipantLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Participant(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.ParticipantLoader.clear(id.toString());
export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IParticipant
) => dataloaders.ParticipantLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IParticipant
) => clearCache(context, id) && primeCache(context, id, data);

type Args = ConnectionArguments & {
  search?: string;
  barbecueIdArgs?: string;
};

export const loadParticipants = async (
  context: GraphQLContext,
  args: Args,
  barbecueId?: string
) => {
  const { barbecueIdArgs } = args;

  const conditions = {
    active: true,
    ...(barbecueId != null ? { barbecue: barbecueId } : {}),
    ...(barbecueIdArgs != null
      ? { barbecue: fromGlobalId(barbecueIdArgs).id }
      : {})
  };

  const participants = ParticipantModel.find(conditions, { _id: 1 }).sort({
    createdAt: -1
  });

  return connectionFromMongoCursor({
    cursor: participants,
    context,
    args,
    loader: load
  });
};

export const loadParticipantsTotal = async (
  context: GraphQLContext,
  args: Args,
  barbecueId?: Types.ObjectId
) => {
  const conditions = {
    active: true,
    ...(barbecueId != null ? { barbecue: barbecueId } : {})
  };

  const aggregate = ParticipantModel.aggregate();

  aggregate.match(conditions).group({
    _id: null,
    sum: { $sum: '$total' }
  });

  const result = await aggregate.exec();
  return result.length ? result[0].sum : null;
};
