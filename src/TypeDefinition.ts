import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IBarbecue } from './modules/barbecue/BarbecueModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  BarbecueLoader: Dataloader<Key, IBarbecue>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
};
