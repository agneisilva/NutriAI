import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNetwork } from '../state/network';
import { borderRadius, colors, shadows, spacing, typography } from '../theme';

export function OfflineIndicator() {
  const { isOffline } = useNetwork();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOffline) {
      setIsVisible(false);
    }
  }, [isOffline]);

  if (!isOffline) {
    return null;
  }

  return (
    <>
      <Pressable onPress={() => setIsVisible(true)} style={styles.iconButton} hitSlop={8}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>i</Text>
        </View>
      </Pressable>

      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={() => setIsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.title}>Modo offline</Text>
                <Text style={styles.description}>
                  Você está sem conexão. Algumas funções podem não funcionar até a internet voltar.
                </Text>
                <Pressable onPress={() => setIsVisible(false)} style={styles.confirmButton}>
                  <Text style={styles.confirmText}>Entendi</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    marginRight: spacing.sm,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: typography.weight.bold,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.size.body,
    lineHeight: 21,
  },
  confirmButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  confirmText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.body,
  },
});