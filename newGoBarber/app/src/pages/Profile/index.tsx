import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import api from '../../services/api';

import {
  Container,
  ButtonHeader,
  BackButton,
  ButtonSignOut,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

import getValidationErros from '../../util/getValidationErros';
import { useAuth } from '../../Hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();
  const { user, updatedUser, signOut } = useAuth();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleUpdateAvatar = useCallback(async () => {
    const { sourceURL } = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    if (sourceURL) {
      const data = new FormData();
      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpeg`,
        uri: sourceURL,
      } as any);

      const { data: responseChangeAvatar } = await api.patch(
        '/user/avatar',
        data,
      );
      updatedUser(responseChangeAvatar);
    }
  }, [updatedUser, user.id]);

  const handleChangedUser = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          // abortEarly ira mostrar todos os erros,caso nao informe ele mostra apenas o primeiro
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const { data: responsePutProfile } = await api.put(
          '/profile',
          formData,
        );
        updatedUser(responsePutProfile);
        Alert.alert('Perfil atualizado com sucesso');
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert('Erro na atualização do perfil, tente novamente');
      }
    },
    [navigation, updatedUser],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <ButtonHeader>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <ButtonSignOut onPress={handleSignOut}>
              <Icon name="power" size={24} color="#999591" />
            </ButtonSignOut>
          </ButtonHeader>
          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>
          <View>
            <Title>Meu perfil</Title>
          </View>
          <Form initialData={user} ref={formRef} onSubmit={handleChangedUser}>
            <Input
              autoCorrect
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />

            <Input
              ref={emailInputRef}
              name="email"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={oldPasswordInputRef}
              name="old_password"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Senha atual"
              returnKeyType="next"
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordInputRef}
              name="password"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Nova senha"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={confirmPasswordInputRef}
              name="password_confirmation"
              secureTextEntry
              textContentType="newPassword"
              icon="lock"
              placeholder="Confirmar senha"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
