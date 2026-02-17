import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';

type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
};

export function ScreenContainer({ children, style, scroll = true, ...props }: ScreenContainerProps) {
  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[styles.container, style]}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
});