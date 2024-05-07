import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeUserProfile.web.ts
// and on native platforms to ReactNativeUserProfile.ts
import ReactNativeUserProfileModule from './ReactNativeUserProfileModule';
import ReactNativeUserProfileView from './ReactNativeUserProfileView';
import { ChangeEventPayload, ReactNativeUserProfileViewProps } from './ReactNativeUserProfile.types';

// Get the native constant value.
export const PI = ReactNativeUserProfileModule.PI;

export function hello(): string {
  return ReactNativeUserProfileModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeUserProfileModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeUserProfileModule ?? NativeModulesProxy.ReactNativeUserProfile);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeUserProfileView, ReactNativeUserProfileViewProps, ChangeEventPayload };
