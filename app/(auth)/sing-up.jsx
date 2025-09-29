import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Envia o cadastro
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError('');
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      // Clerk costuma retornar err.errors[0].message; caímos para fallback se não existir
      // @ts-ignore
      const clerkMsg = err?.errors?.[0]?.message;
      const message = clerkMsg ?? err?.message ?? 'Ocorreu um erro ao criar sua conta.';
      setError(message);
      console.error(err);
    }
  };

  // Valida o código enviado por e-mail
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError('');
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/'); // ajuste a rota se necessário
      } else {
        setError('Verificação incompleta. Tente novamente.');
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // @ts-ignore
      const clerkMsg = err?.errors?.[0]?.message;
      const message = clerkMsg ?? err?.message ?? 'Falha na verificação do código.';
      setError(message);
      console.error(err);
    }
  };

  // Tela de verificação de e-mail
  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verifique seu e-mail</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          value={code}
          placeholder="Digite o código recebido"
          placeholderTextColor={COLORS.textLight}
          onChangeText={setCode}
          style={styles.input}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela de cadastro
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={24}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/casa.png')}
          style={styles.ilustration}
        />

        <Text style={styles.title}>Crie sua conta</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Seu e-mail"
          placeholderTextColor="#864283ff"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={password}
          placeholder="Sua senha"
          placeholderTextColor="#864283ff"
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}