import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { colors, themeStyles } from '../theme';

type ScreenProps = ViewProps & {
  scroll?: boolean;
};

export function Screen({ children, style, scroll = true, ...props }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[styles.container, themeStyles.screenPadding, style]}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, themeStyles.screenPadding, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});