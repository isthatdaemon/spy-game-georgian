import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, Surface, useTheme } from 'react-native-paper';

interface PlayerCountSelectorProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({
  count,
  onIncrement,
  onDecrement,
}) => {
  const theme = useTheme();

  return (
    <Surface
      style={[styles.container]}
    >
      <Text
        variant="titleLarge"
        style={[styles.label]}
      >
        მოთამაშეების რაოდენობა
        (მინ. 3, მაქს. 10)
      </Text>
      <View style={styles.controls}>
        <IconButton
          icon="minus"
          mode="contained-tonal"
          onPress={onDecrement}
          size={24}
          iconColor={"black"}
          containerColor={"white"}
        />
        <Text
          variant="headlineMedium"
          style={[styles.count, { color: "white" }]}
        >
          {count}
        </Text>
        <IconButton
          icon="plus"
          mode="contained-tonal"
          onPress={onIncrement}
          size={24}
          iconColor={"black"}
          containerColor={"white"}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginBottom: 120,
  },
  label: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  count: {
    paddingHorizontal: 24,
  },
});
