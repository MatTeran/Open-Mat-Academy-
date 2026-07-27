import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export type ProfilePhotoSource = 'camera' | 'library';

async function ensurePermission(source: ProfilePhotoSource): Promise<boolean> {
  if (source === 'camera') {
    const current = await ImagePicker.getCameraPermissionsAsync();
    if (current.granted) {
      return true;
    }
    const requested = await ImagePicker.requestCameraPermissionsAsync();
    if (requested.granted) {
      return true;
    }
  } else {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (current.granted) {
      return true;
    }
    const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (requested.granted) {
      return true;
    }
  }

  Alert.alert(
    'Permission needed',
    source === 'camera'
      ? 'Allow camera access to take a profile photo.'
      : 'Allow photo library access to choose a profile photo.',
    [
      { text: 'Not now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
  return false;
}

export async function pickProfilePhoto(
  source: ProfilePhotoSource,
): Promise<string | null> {
  const allowed = await ensurePermission(source);
  if (!allowed) {
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return null;
  }

  return result.assets[0].uri;
}

export function promptProfilePhotoActions(options: {
  hasPhoto: boolean;
  onTakePhoto: () => void;
  onChooseLibrary: () => void;
  onRemove: () => void;
}): void {
  const buttons = [
    { text: 'Take photo', onPress: options.onTakePhoto },
    { text: 'Choose from library', onPress: options.onChooseLibrary },
    ...(options.hasPhoto
      ? [
          {
            text: 'Remove photo',
            style: 'destructive' as const,
            onPress: options.onRemove,
          },
        ]
      : []),
    { text: 'Cancel', style: 'cancel' as const },
  ];

  Alert.alert('Profile photo', 'Add a photo teammates will recognize.', buttons);
}
