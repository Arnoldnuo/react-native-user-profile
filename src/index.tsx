/* eslint-disable prettier/prettier */
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Text, View, Card, Avatar, Modal, ActionBar, TextField, TouchableOpacity, Incubator } from 'react-native-ui-lib';

import { uploadAvatarToCos } from './cos';

interface UserProfileProps {
  rightIcon: any,
  onPress: any,
  nickname: string,
  biography: string,
  avatar_url: string,
}

interface UserProfileEditorProps {
  rightIcon: any,
  nickname: string,
  biography: string,
  avatar_url: string,
  onNicknameSave?: any,
  onBiographySave?: any,
  onAvatarSave?: any,
  update_url?: string,
  jwt?: string,
  cosTmpCredential_url?: string,
  avatar_bucket?: string,
  avatar_region?: string,
}

const UserProfile = (props: UserProfileProps) => {
  const { rightIcon, onPress, nickname, biography, avatar_url } = props;
  return (<View paddingH-10>
    <Card enableBlur={false} enableShadow={false} row centerV
      onPress={onPress}
      backgroundColor="rgba(0, 0, 0,0)">
      <Avatar source={{ uri: avatar_url }} />
      <View marginH-10 style={{ flexGrow: 1, flexShrink: 1 }} >
        <Text text60BO marginB-8>{nickname}</Text>
        <Text text80R>{biography}</Text>
      </View>
      <View>
        {rightIcon}
      </View>
    </Card>
  </View>);
};

enum EditorType {
  nickname = 'nickname',
  biography = 'biography'
}

const UserProfileEditor = (props: UserProfileEditorProps) => {
  const { rightIcon, nickname, biography, avatar_url, onBiographySave, onNicknameSave, onAvatarSave, update_url, jwt, cosTmpCredential_url, avatar_bucket, avatar_region } = props;
  const [editorVisible, setEditorVisible] = useState(false);
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [maxLength, setMaxLength] = useState(10);
  const editorTypeRef = useRef<EditorType>(EditorType.nickname);
  const [toastVisible, setToastVisible] = useState(false);
  const [avatarToastVisible, setAvatarToastVisible] = useState(false);

  const showNicknameEditor = () => {
    editorTypeRef.current = EditorType.nickname;
    setText(nickname);
    setPlaceholder('昵称');
    setMaxLength(16);
    setEditorVisible(true);
  };
  const showBiographyEditor = () => {
    editorTypeRef.current = EditorType.biography;
    setText(biography);
    setPlaceholder('个人简介');
    setMaxLength(30);
    setEditorVisible(true);
  }

  const hideEditor = () => {
    setEditorVisible(false);
    setToastVisible(false);
  };
  const saveEditorResultToServer = async (data) => {
    if (!update_url || !jwt) return;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${jwt}`);

    const requestOptions = { method: "POST", headers: myHeaders, body: JSON.stringify(data) };
    const response = await fetch(update_url, requestOptions)
    if (!response.ok) {
      setToastVisible(true);
      throw new Error('nickname或biography保存失败');
    }
  };
  const saveEditorResult = async () => {
    if (editorTypeRef.current === EditorType.nickname) {
      await saveEditorResultToServer({ nickname: text });
      onNicknameSave && onNicknameSave(text);
    } else if (editorTypeRef.current === EditorType.biography) {
      await saveEditorResultToServer({ biography: text });
      onBiographySave && onBiographySave(text);
    }
    hideEditor();
  };

  const showAvatorEditor = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.1 });
    if (result.canceled) return;
    setAvatarToastVisible(true);
    const avatarFile = result.assets[0].uri;
    if (cosTmpCredential_url && avatar_bucket && avatar_region && jwt) {
      const coskey = await uploadAvatarToCos({
        avatarFile, cosTmpCredential_url, jwt,
        bucket: avatar_bucket, region: avatar_region
      });
      if (coskey) {
        await saveEditorResultToServer({ avatar_cos: coskey });
      } else {
        setAvatarToastVisible(false);
        setToastVisible(true);
      }
    }
    onAvatarSave && onAvatarSave(avatarFile);
    setAvatarToastVisible(false);
  };

  return <View>
    <TouchableOpacity style={$RowItem} onPress={showAvatorEditor}>
      <View><Text text70R>头像</Text></View>
      <View flexG right marginR-10>
        <Avatar source={{ uri: avatar_url }} />
      </View>
      <View>{rightIcon}</View>
    </TouchableOpacity>
    <TouchableOpacity style={$RowItem} onPress={showNicknameEditor}>
      <View><Text text70R>昵称</Text></View>
      <View flexG right marginR-10><Text text70L>{nickname}</Text></View>
      <View>{rightIcon}</View>
    </TouchableOpacity>
    <TouchableOpacity style={[$RowItem, { borderBottomWidth: 0 }]}
      onPress={showBiographyEditor}>
      <View><Text text70R>个人简介</Text></View>
      <View style={{ flexGrow: 1, flexShrink: 1 }} right marginR-10>
        <Text text70L>{biography}</Text></View>
      <View>{rightIcon}</View>
    </TouchableOpacity>
    <Incubator.Toast
      visible={avatarToastVisible}
      position='top'
      message='头像上传中...'
      preset='general'
      autoDismiss={0}
    />
    <Modal visible={editorVisible}>
      <Incubator.Toast
        visible={toastVisible}
        position='top'
        message='保存失败请重试'
        preset='failure'
        autoDismiss={5000}
        onDismiss={() => { setToastVisible(false); }}
      />
      <ActionBar style={{ height: 'auto' }} keepRelative actions={[
        { label: '取消', onPress: hideEditor },
        { label: '保存', onPress: saveEditorResult, disabled: text.trim().length < 2 && editorTypeRef.current === EditorType.nickname }
      ]} />
      <View paddingH-20 paddingT-8>
        <TextField
          style={{ borderBottomWidth: 1, paddingBottom: 6, paddingTop: 3 }}
          placeholder={placeholder}
          floatingPlaceholder
          value={text}
          onChangeText={setText}
          showCharCounter
          maxLength={maxLength}
        />
      </View>
    </Modal>
  </View>;
};

export { UserProfile, UserProfileEditor };
const $RowItem: ViewStyle = {
  borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#c0c0c0',
  paddingVertical: 10,
  marginHorizontal: 10,
  flexDirection: 'row',
  alignItems: 'center',
}
