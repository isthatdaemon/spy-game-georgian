import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const theme = useTheme();

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.elevation.level2 }]}
      elevation={2}
    >
      <Text
        variant="displaySmall"
        style={[styles.timerText, { color: theme.colors.onSurface }]}
      >
        {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  timerText: {
    fontVariant: ['tabular-nums'],
  },
});
