import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import {
  AnamneseAnswerResponse,
  answerAnamnese,
  isApiError,
  startAnamnese,
} from '../services/api';
import { useNetwork } from '../state/network';
import { useOnboarding } from '../state/onboarding';
import { borderRadius, colors, spacing, typography } from '../theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStackParamList } from '../navigation/types';

type MessageRole = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
};

type ChatNavigation = NativeStackNavigationProp<OnboardingStackParamList, 'AnamneseChat'>;

function messageId() {
  return `${Date.now()}-${Math.random()}`;
}

export function AnamneseChatScreen() {
  const navigation = useNavigation<ChatNavigation>();
  const { isOffline } = useNetwork();
  const { setLastSessionId, setAnamneseResult } = useOnboarding();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isStarting, setIsStarting] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  const canSkip = useMemo(() => currentStep === 3 || currentStep === 7, [currentStep]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const appendMessage = (role: MessageRole, text: string) => {
    setMessages((prev) => [...prev, { id: messageId(), role, text }]);
  };

  const initializeChat = useCallback(async () => {
    setIsStarting(true);

    try {
      const start = await startAnamnese('pt-BR');
      setSessionId(start.session_id);
      setCurrentStep(start.step);
      await setLastSessionId(start.session_id);
      appendMessage('assistant', start.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não conseguimos iniciar sua anamnese agora. Tente novamente.';

      setOfflineNotice(message);
    } finally {
      setIsStarting(false);
    }
  }, [setLastSessionId]);

  useEffect(() => {
    if (isOffline) {
      setOfflineNotice('Sem internet. Conecte-se para continuar.');
      setIsStarting(false);
      return;
    }

    setOfflineNotice(null);

    if (!sessionId && messages.length === 0) {
      void initializeChat();
    }
  }, [initializeChat, isOffline, messages.length, sessionId]);

  const handleApiResponse = async (response: AnamneseAnswerResponse) => {
    if (response.done) {
      await setAnamneseResult({
        session_id: response.session_id,
        profile: response.profile,
        bmi: response.bmi,
        summary: response.summary,
      });
      navigation.navigate('AnamneseResult');
      return;
    }

    setCurrentStep(response.step);
    appendMessage('assistant', response.message);
  };

  const sendAnswer = async (answer: string) => {
    if (!sessionId || isSending || isStarting) {
      return;
    }

    if (isOffline) {
      setOfflineNotice('Sem internet. Conecte-se para continuar.');
      return;
    }

    const sanitized = answer.trim();
    if (!sanitized && currentStep !== 7) {
      return;
    }

    appendMessage('user', sanitized || '-');
    setInputText('');
    setIsSending(true);

    try {
      const response = await answerAnamnese(sessionId, sanitized);
      await handleApiResponse(response);
    } catch (error) {
      if (isApiError(error) && error.status === 400) {
        appendMessage('assistant', error.message || 'Não entendi. Pode responder de outro jeito?');
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Não conseguimos continuar agora. Tente novamente em instantes.';
        appendMessage('assistant', message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSkip = async () => {
    const value = currentStep === 3 ? 'pular' : '-';
    await sendAnswer(value);
  };

  const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => {
    const isAssistant = item.role === 'assistant';

    return (
      <View style={[styles.messageRow, isAssistant ? styles.left : styles.right]}>
        <View style={[styles.bubble, isAssistant ? styles.bubbleAssistant : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAssistant ? styles.bubbleTextAssistant : styles.bubbleTextUser]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Screen scroll={false} style={styles.container}>
      <Card>
        <Text style={styles.title}>Vamos conversar rapidinho</Text>
        <Text style={styles.subtitle}>Leva menos de 2 minutos e já te dá um primeiro direcionamento.</Text>
      </Card>

      {offlineNotice ? (
        <Card>
          <Text style={styles.offlineTitle}>{offlineNotice}</Text>
          <PrimaryButton title="Tentar novamente" onPress={() => void initializeChat()} />
        </Card>
      ) : null}

      <View style={styles.chatWrap}>
        {isStarting ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Iniciando sua anamnese...</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua resposta"
          placeholderTextColor={colors.textMuted}
          editable={!isSending && !isStarting && !isOffline}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={() => void sendAnswer(inputText)}
        />

        <View style={styles.actionsRow}>
          {canSkip ? (
            <Pressable onPress={() => void handleSkip()} disabled={isSending || isStarting} style={styles.skipButton}>
              <Text style={styles.skipText}>Pular</Text>
            </Pressable>
          ) : null}
          <PrimaryButton
            title="Enviar"
            onPress={() => void sendAnswer(inputText)}
            loading={isSending}
            disabled={isStarting || isOffline}
            style={styles.sendButton}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.size.body,
    lineHeight: 21,
  },
  offlineTitle: {
    color: colors.text,
    fontSize: typography.size.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  chatWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  chatContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageRow: {
    marginBottom: spacing.sm,
    width: '100%',
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '84%',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
  },
  bubbleText: {
    fontSize: typography.size.body,
    lineHeight: 20,
  },
  bubbleTextAssistant: {
    color: colors.text,
  },
  bubbleTextUser: {
    color: colors.white,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.size.body,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.background,
    fontSize: typography.size.body,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
  },
  sendButton: {
    minWidth: 120,
  },
});
