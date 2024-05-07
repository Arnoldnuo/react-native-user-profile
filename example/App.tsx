import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeUserProfile from 'react-native-user-profile';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeUserProfile.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
