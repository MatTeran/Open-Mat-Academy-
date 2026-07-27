import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

// Member app keeps its local supabase client; shared mobile wiring is
// available when Member migrates fully onto @openmat/shared.
registerRootComponent(App);
