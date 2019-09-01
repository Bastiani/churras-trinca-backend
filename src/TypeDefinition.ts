import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IBarbecue } from './modules/barbecue/BarbecueModel';
import { IParticipant } from './modules/participant/ParticipantModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  BarbecueLoader: Dataloader<Key, IBarbecue>;
  ParticipantLoader: Dataloader<Key, IParticipant>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
};
