import type { NavigatorScreenParams } from '@react-navigation/native';

import type { AuthStackParamList, MainTabParamList } from '../types';

export type { AuthStackParamList, MainTabParamList };

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
