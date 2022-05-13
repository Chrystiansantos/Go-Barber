import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert, Platform } from 'react-native';
import { format } from 'date-fns';
import { useAuth } from '../../Hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  Content,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
  providerName: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>();
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [selectedProviderName, setSelectedProviderName] = useState(
    routeParams.providerName,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailabily] = useState<AvailabilityItem[]>([]);
  const [selectdHour, setSelectdHour] = useState(0);

  useEffect(() => {
    async function getProviders() {
      const { data } = await api.get('providers');
      setProviders(data);
    }
    getProviders();
  }, []);

  useEffect(() => {
    async function getDayAvailability() {
      const { data } = await api.get<AvailabilityItem[]>(
        `providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        },
      );
      setAvailabily(data);
    }
    getDayAvailability();
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(
    (providerId: string, providerName: string) => {
      setSelectedProvider(providerId);
      setSelectedProviderName(providerName);
    },
    [],
  );

  const handleToggleDatepicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [availability]);

  const afternonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [availability]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectdHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectdHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', {
        date: date.getTime(),
        nameBarber: selectedProviderName,
      });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento tente novamente',
      );
    }
  }, [
    navigate,
    selectedDate,
    selectdHour,
    selectedProviderName,
    selectedProvider,
  ]);
  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Barbeiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id, provider.name)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerButton onPress={handleToggleDatepicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              textColor="#f4ede8"
              mode="date"
              onChange={handleDateChange}
              // display="default"
              display="spinner"
              locale="pt-br"
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hourFormatted, available, hour }) => (
                <Hour
                  enabled={available === true}
                  selected={selectdHour === hour && available === true}
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={hourFormatted}
                >
                  <HourText
                    selected={selectdHour === hour && available === true}
                  >
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternonAvailability.map(
                ({ hourFormatted, available, hour }) => (
                  <Hour
                    enabled={available === true}
                    selected={selectdHour === hour && available === true}
                    onPress={() => handleSelectHour(hour)}
                    available={available}
                    key={hourFormatted}
                  >
                    <HourText
                      selected={selectdHour === hour && available === true}
                    >
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
