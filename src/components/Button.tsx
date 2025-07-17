import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  mode?: 'text' | 'outlined' | 'contained';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  mode = 'contained',
  icon
}) => {

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      icon={icon}
      style={[
        styles.button,
        mode === 'contained' && { marginVertical: 8 }
      ]}
      contentStyle={styles.buttonContent}
      uppercase={false}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    minWidth: 200,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
