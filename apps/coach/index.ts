import 'react-native-gesture-handler';

import { ensureMobileSupabaseConfigured } from '@openmat/shared/services/mobile';
import { registerRootComponent } from 'expo';

import App from './App';

ensureMobileSupabaseConfigured();

registerRootComponent(App);
