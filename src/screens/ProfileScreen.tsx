import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SecondaryButton } from '../components/SecondaryButton';
import { TextField } from '../components/TextField';
import { useProfile } from '../state/profile';
import { borderRadius, colors, spacing, typography } from '../theme';

export function ProfileScreen() {
  const { name, photoUri, updateProfile } = useProfile();
  const [nameInput, setNameInput] = useState(name);
  const [photoInput, setPhotoInput] = useState<string | undefined>(photoUri);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNameInput(name);
    setPhotoInput(photoUri);
  }, [name, photoUri]);

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria para escolher uma foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoInput(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: nameInput,
        photoUri: photoInput,
      });
      Alert.alert('Sucesso', 'Salvo com sucesso');
    } finally {
      setSaving(false);
    }
  };

  const firstLetter = nameInput.trim().charAt(0).toUpperCase() || 'U';

  return (
    <Screen>
      <Card style={styles.avatarCard}>
        {photoInput ? (
          <Image source={{ uri: photoInput }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        )}

        <SecondaryButton title="Alterar foto" onPress={() => void handleChangePhoto()} />
      </Card>

      <Card>
        <TextField
          label="Nome"
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Digite seu nome"
          autoCorrect={false}
        />

        <PrimaryButton title="Salvar" onPress={() => void handleSave()} loading={saving} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    alignItems: 'center',
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.md,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.md,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: typography.weight.bold,
  },
});