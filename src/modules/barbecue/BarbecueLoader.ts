import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import mongoose, { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import BarbecueModel, { IBarbecue } from './BarbecueModel';
import { GraphQLContext } from '../../TypeDefinition';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Barbecue {
  id: string;
  _id: Types.ObjectId;
  date: Date;
  description: string | undefined;
  observation: string | undefined;
  participants: ObjectId[] | undefined;
  total: string;
  active: boolean | null | undefined;

  constructor(data: IBarbecue) {
    this.id = data.id;
    this._id = data._id;
    this.date = data.date;
    this.description = data.description;
    this.observation = data.observation;
    this.participants = data.participants;
    this.total = data.total;
    this.active = data.active;
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(BarbecueModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id: string | Object | ObjectId): Promise<Barbecue | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.BarbecueLoader.load((id as string));
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Barbecue(data) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.BarbecueLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IBarbecue) => dataloaders.BarbecueLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IBarbecue) => clearCache(context, id) && primeCache(context, id, data);

type BarbecueArgs = ConnectionArguments & {
  search?: string;
};
export const loadBarbecues = async (context: GraphQLContext, args: BarbecueArgs) => {
  const where = args.search ? { description: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const barbecues = BarbecueModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: barbecues,
    context,
    args,
    loader: load,
  });
};
