import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.styles' // removi .js, mantém alias
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/color'
import { Image } from 'expo-image'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    setError('')
    try {
      // Atenção: verifique a API do Clerk na sua versão caso precise de outro formato
      await signUp.create({
        emailAddress,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      const message = err?.message ?? JSON.stringify(err)
      setError(message)
      console.error(err)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    setError('')
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        const info = JSON.stringify(signUpAttempt, null, 2)
        setError('Verificação incompleta. Veja console para detalhes.')
        console.error(info)
      }
    } catch (err) {
      const message = err?.message ?? JSON.stringify(err)
      setError(message)
      console.error(err)
    }
  }

  // Tela de verificação
  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

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
          placeholder="Enter your verification code"
          onChangeText={setCode}
          style={styles.input}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Tela de cadastro normal
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        {/* Corrigi o caminho assets (antes estava 'assents') */}
        <Image source={require('../assets/images/casa.png')} style={styles.ilustration} />

        <Text style={styles.title}>Sign up</Text>

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
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in" style={{ marginLeft: 6 }}>
            <Text style={{ color: COLORS.primary }}>Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  )
}