import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  Surface,
  Text,
  MD3Theme,
} from 'react-native-paper';
import { Button } from './src/components/Button';
import { PlayerCountSelector } from './src/components/PlayerCountSelector';
import { Timer } from './src/components/Timer';
import { RoleCard } from './src/components/RoleCard';
import {
  LOCATIONS,
  MIN_PLAYERS,
  MAX_PLAYERS,
  DEFAULT_TIMER_SECONDS,
} from './src/data/constants';
import { GameState } from './src/types';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Match the app's background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  bottomButton: {
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  roleCard: {
    padding: 24,
    borderRadius: 12,
    marginVertical: 24,
    width: '100%',
    maxWidth: 400,
  },
  roleText: {
    textAlign: 'center',
  },
  // Theme toggle removed
});

const appTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ffffffff',
    secondary: '#2196F3',
    secondaryContainer: '#0d47a1',
    onSecondaryContainer: '#bbdefb',
    background: '#121212',
    surface: '#121212',
    surfaceVariant: '#1e1e1e',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: '#121212',
      level1: '#1e1e1e',
      level2: '#232323',
      level3: '#282828',
    }
  },
} as MD3Theme;

// Preload and cache the logo image
const cacheImages = async () => {
  const imageAssets = [require('./assets/spy-logo.png')];
  const cachePromises = imageAssets.map(image => {
    return Asset.fromModule(image).downloadAsync();
  });
  return Promise.all(cachePromises);
};

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isGameStarted: false,
    numberOfPlayers: 3,
    currentPlayerIndex: -1,
    locations: LOCATIONS,
    selectedLocation: '',
    spyIndex: -1,
    showRole: false,
    timerSeconds: DEFAULT_TIMER_SECONDS,
    isTimerRunning: false
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we prepare resources
        await SplashScreen.preventAutoHideAsync();
        
        // Pre-load and cache the logo image
        await cacheImages();

        // Simulate any other initialization if needed
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isTimerRunning && gameState.timerSeconds > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timerSeconds: prev.timerSeconds - 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.isTimerRunning]);

  const startGame = useCallback(() => {
    const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const randomSpyIndex = Math.floor(Math.random() * gameState.numberOfPlayers);

    setGameState(prev => ({
      ...prev,
      isGameStarted: true,
      currentPlayerIndex: 0,
      selectedLocation: randomLocation,
      spyIndex: randomSpyIndex,
      showRole: false,
      timerSeconds: DEFAULT_TIMER_SECONDS,
      isTimerRunning: false
    }));
  }, [gameState.numberOfPlayers]);

  const showNextPlayer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: prev.currentPlayerIndex + 1,
      showRole: false,
    }));
  }, []);

  const revealRole = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showRole: true,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameStarted: false,
      currentPlayerIndex: -1,
      showRole: false,
      timerSeconds: DEFAULT_TIMER_SECONDS,
      isTimerRunning: false
    }));
  }, []);

  const toggleTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timerSeconds: DEFAULT_TIMER_SECONDS,
      isTimerRunning: false
    }));
  }, []);

  // Theme toggle removed

  const incrementPlayers = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      numberOfPlayers: Math.min(prev.numberOfPlayers + 1, MAX_PLAYERS),
    }));
  }, []);

  const decrementPlayers = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      numberOfPlayers: Math.max(prev.numberOfPlayers - 1, MIN_PLAYERS),
    }));
  }, []);

  const renderContent = () => {
    if (!gameState.isGameStarted) {
      return (
        <Surface style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./assets/spy-logo.png')}
              style={styles.logo}
              fadeDuration={0}
            />
          </View>
          <PlayerCountSelector
            count={gameState.numberOfPlayers}
            onIncrement={incrementPlayers}
            onDecrement={decrementPlayers}
          />
          <Button
            title="თამაშის დაწყება"
            onPress={startGame}
            mode="contained"
            icon="play"
          />
        </Surface>
      );
    }

    if (gameState.currentPlayerIndex >= gameState.numberOfPlayers) {
      return (
        <Surface style={styles.container}>
          <View style={styles.content}>
            <Text variant="displaySmall" style={[styles.title, { marginBottom: 60 }]}>
              თქვენს შორის არის ჯაშუში!
            </Text>
            <Timer seconds={gameState.timerSeconds} />
          </View>
          <View style={[styles.bottomButton, { gap: 10 }]}>
            <Button
              title={gameState.isTimerRunning ? "დაპაუზება" : "დაწყება"}
              onPress={toggleTimer}
              mode="contained"
              icon={gameState.isTimerRunning ? "pause" : "play"}
            />
            <Button
              title="ტაიმერის თავიდან დაწყება"
              onPress={resetTimer}
              mode="outlined"
              icon="refresh"
            />
            <Button
              title="ახალი თამაში"
              onPress={resetGame}
              mode="contained"
              icon="restart"
            />
          </View>
        </Surface>
      );
    }

    return (
      <Surface style={styles.container}>
        <View style={styles.content}>
          <RoleCard
            isSpy={gameState.currentPlayerIndex === gameState.spyIndex}
            location={gameState.selectedLocation}
            isRevealed={gameState.showRole}
            onReveal={revealRole}
            playerIndex={gameState.currentPlayerIndex}
          />
        </View>
        {gameState.showRole && (
          <View style={styles.bottomButton}>
            <Button
              title="შემდეგი მოთამაშე"
              onPress={showNextPlayer}
              mode="contained"
              icon="arrow-right"
            />
          </View>
        )}
      </Surface>
    );
  };

  useEffect(() => {
    if (!isLoading && isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isAppReady]);

  if (isLoading || !isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <StatusBar style="light" translucent backgroundColor="transparent" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {renderContent()}
      <StatusBar style="light" translucent backgroundColor="transparent" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PaperProvider theme={appTheme}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
