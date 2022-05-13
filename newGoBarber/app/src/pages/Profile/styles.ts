import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 30}px;
`;

export const ButtonHeader = styled.View`
  margin-top: 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  /* display: flex; */
  /* align-items: center; */
`;

export const BackButton = styled.TouchableOpacity`
  /* background-color: red; */
  /* width: 20px; */
`;
export const ButtonSignOut = styled.TouchableOpacity`
  /* background-color: blue; */
  /* width: 50%; */
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
  text-align: left;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 64px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;
