import React from 'react';
import { StyleSheet, Pressable, Dimensions, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - 48, 400);

interface RoleCardProps {
  isSpy: boolean;
  location: string;
  isRevealed: boolean;
  onReveal: () => void;
  playerIndex: number; // Add playerIndex to track changes
}

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export const RoleCard: React.FC<RoleCardProps> = ({
  isSpy,
  location,
  isRevealed,
  onReveal,
  playerIndex,
}) => {
  const theme = useTheme();
  const flipAnimation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Reset card state when player changes
  React.useEffect(() => {
    // Reset the flip state
    setIsFlipped(false);
    // Reset the animation with immediate timing
    flipAnimation.value = withTiming(0, {
      duration: 0,
    });
  }, [playerIndex]);

  const flipCard = () => {
    // Only allow flip if not already flipped
    if (!isFlipped) {
      flipAnimation.value = withSequence(
        withTiming(0.5, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      );
      // Delay the state updates until the animation reaches the middle
      setTimeout(() => {
        setIsFlipped(true);
        onReveal();
      }, 300);
    }
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      flipAnimation.value,
      [0, 0.5, 1],
      [0, 90, 180]
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotate}deg` },
      ],
      opacity: flipAnimation.value <= 0.5 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      flipAnimation.value,
      [0, 0.5, 1],
      [180, 270, 360]
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotate}deg` },
      ],
      opacity: flipAnimation.value > 0.5 ? 1 : 0,
    };
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardWrapper: {
      width: CARD_WIDTH,
      height: CARD_WIDTH * 1.4,
      alignSelf: 'center',
    },
    card: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      padding: 24,
      elevation: 4,
      backgroundColor: theme.colors.elevation.level2,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    frontCard: {
      backgroundColor: theme.colors.elevation.level3,
      borderColor: theme.colors.outlineVariant,
    },
    tapText: {
      opacity: 0.7,
      marginTop: 16,
    },
    roleText: {
      textAlign: 'center',
      marginBottom: 16,
    },
    locationText: {
      textAlign: 'center',
      opacity: 0.8,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.cardWrapper}
        onPress={!isRevealed ? flipCard : undefined}
      >
        <AnimatedSurface style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          <Text variant="headlineMedium" style={styles.roleText}>
            დააჭირე სანახავად
          </Text>
          <Text variant="bodyLarge" style={styles.tapText}>
            დარწმუნდი, რომ მხოლოდ შენ ნახულობ!
          </Text>
        </AnimatedSurface>
        
        <AnimatedSurface style={[styles.card, backAnimatedStyle]}>
          {isFlipped && (
            <>
              <Text variant="headlineMedium" style={styles.roleText}>
                {isSpy ? "შენ ხარ ჯაშუში!" : "შენი სიტყვა არის..."}
              </Text>
              {!isSpy && (
                <Text variant="titleLarge" style={styles.locationText}>
                  {location}
                </Text>
              )}
            </>
          )}
        </AnimatedSurface>
      </Pressable>
    </View>
  );
};
