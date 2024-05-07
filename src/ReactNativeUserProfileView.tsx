import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeUserProfileViewProps } from './ReactNativeUserProfile.types';

const NativeView: React.ComponentType<ReactNativeUserProfileViewProps> =
  requireNativeViewManager('ReactNativeUserProfile');

export default function ReactNativeUserProfileView(props: ReactNativeUserProfileViewProps) {
  return <NativeView {...props} />;
}
