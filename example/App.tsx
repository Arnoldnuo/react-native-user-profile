/* eslint-disable prettier/prettier */
require('node-libs-react-native/globals');
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import { UserProfile, UserProfileEditor } from 'react-native-user-profile';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { avatar_bucket, avatar_region, avatar_url, cosTmpCredential_url, jwt, update_url } from './config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>

        <View paddingT-100>
          <View paddingV-100>
            <UserProfile
              rightIcon={<AntDesign name="right" size={18} color="gray" />}
              onPress={() => { console.log(123) }}
              nickname='小李'
              biography='你好啊啊啊啊啊啊啊啊啊啊'
              avatar_url={avatar_url}
            />
          </View>
          <View style={{ height: 300 }}>
            <UserProfileEditor
              rightIcon={<AntDesign name="right" size={12} color="gray" />}
              nickname='小李'
              biography='你好啊啊啊啊啊啊啊啊啊啊'
              avatar_url={avatar_url}
              onNicknameSave={(nickname: string) => { console.log('nickname', nickname) }}
              onBiographySave={(biography: string) => { console.log('biography', biography) }}
              onAvatarSave={(avatarFile: string) => { console.log('avatar', avatarFile) }}
              onLogout={() => { console.log('logout') }}
              update_url={update_url}
              jwt={jwt}
              cosTmpCredential_url={cosTmpCredential_url}
              avatar_bucket={avatar_bucket}
              avatar_region={avatar_region}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
