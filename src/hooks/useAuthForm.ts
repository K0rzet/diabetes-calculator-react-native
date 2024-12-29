import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../types/navigation.types';
import { authStore } from '../stores/AuthStore';
import { GoogleRecaptchaRefAttributes } from 'react-native-google-recaptcha';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export const useAuthForm = (
  isLogin: boolean, 
  captchaRef: React.RefObject<GoogleRecaptchaRefAttributes | null>
) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isCaptchaReady, setIsCaptchaReady] = useState(false);
  const lastSubmittedData = useRef<AuthFormData | null>(null);

  const handleSubmit = async (data: AuthFormData & { recaptchaToken?: string }) => {
    try {
      if (!data.recaptchaToken) {
        lastSubmittedData.current = data;
        if (captchaRef.current) {
          await captchaRef.current.open();
        }
        return;
      }

      setIsSubmitting(true);
      setError(null);

      if (isLogin) {
        await authStore.login({
          email: data.email,
          password: data.password,
          recaptchaToken: data.recaptchaToken,
        });
        navigation.replace('MainTabs');
      } else {
        if (!data.name) {
          throw new Error('Не все данные заполнены');
        }
        await authStore.register({
          email: data.email,
          password: data.password,
          name: data.name,
          recaptchaToken: data.recaptchaToken,
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError(isLogin ? 'Ошибка при входе' : 'Ошибка при регистрации');
      setShowCaptcha(false);
      setIsCaptchaReady(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    console.log('Captcha verified with token');
    if (lastSubmittedData.current) {
      const data = lastSubmittedData.current;
      lastSubmittedData.current = null; // Очищаем сохраненные данные
      setShowCaptcha(true);
      handleSubmit({
        ...data,
        recaptchaToken: token
      });
    }
  };

  const handleCaptchaError = () => {
    console.error('Captcha error');
    setError('Ошибка капчи');
    setShowCaptcha(false);
    setIsCaptchaReady(false);
  };

  const handleCaptchaLoad = () => {
    console.log('Captcha loaded');
    setIsCaptchaReady(true);
  };

  return {
    handleSubmit,
    isLoading: isSubmitting || authStore.isLoading,
    error,
    setError,
    showCaptcha,
    handleCaptchaVerify,
    handleCaptchaError,
    handleCaptchaLoad,
  };
}; 