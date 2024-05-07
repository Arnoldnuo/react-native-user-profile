import * as React from 'react';

import { ReactNativeUserProfileViewProps } from './ReactNativeUserProfile.types';

export default function ReactNativeUserProfileView(props: ReactNativeUserProfileViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
