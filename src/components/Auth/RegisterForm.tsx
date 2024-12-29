import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores/AuthStore';
import GoogleRecaptcha, {
  GoogleRecaptchaRefAttributes,
  GoogleRecaptchaSize
} from 'react-native-google-recaptcha';
import Constants from 'expo-constants';
import { useAuthForm } from '../../hooks/useAuthForm';

export const RegisterForm = observer(() => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const recaptchaRef = useRef<GoogleRecaptchaRefAttributes>(null);

  const {
    handleSubmit,
    isLoading,
    error,
    handleCaptchaError,
    handleCaptchaVerify,
    handleCaptchaLoad,
  } = useAuthForm(false, recaptchaRef);

  const onSubmit = async () => {
    console.log('Submit clicked, ref:', !!recaptchaRef.current);
    try {
      await handleSubmit(values);
    } catch (e) {
      console.error('Submit error:', e);
      handleCaptchaError();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Имя"
        value={values.name}
        onChangeText={(text) => setValues({ ...values, name: text })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={values.email}
        onChangeText={(text) => setValues({ ...values, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Пароль"
        value={values.password}
        onChangeText={(text) => setValues({ ...values, password: text })}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={onSubmit}
        disabled={!values.name || !values.email || !values.password || isLoading}
        loading={isLoading}
      >
        Зарегистрироваться
      </Button>

      <GoogleRecaptcha
        ref={recaptchaRef}
        baseUrl={Constants.expoConfig?.extra?.baseUrl ?? ''}
        siteKey={Constants.expoConfig?.extra?.recaptchaSiteKey ?? ''}
        size={GoogleRecaptchaSize.NORMAL}
        onVerify={handleCaptchaVerify}
        onError={handleCaptchaError}
        onLoad={handleCaptchaLoad}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  recaptchaContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
}); 