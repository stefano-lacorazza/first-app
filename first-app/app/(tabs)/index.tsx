import React, { useState, useEffect, useRef } from 'react';
import { Animated, TextInput, Button, View, Text, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { sendTextToChatGPT } from '@/api/chatgpt';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = () => {
    sendTextToChatGPT(text).then(setSubmittedText);
  };

  useEffect(() => {
    if (submittedText) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [submittedText]);

  const handleTextChange = (input: string) => {
    setText(input);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      handleSubmit();
    }, 2000);
    setTimer(newTimer);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter text here"
        style={styles.input}
        onChangeText={handleTextChange}
        value={text}
      />

      {submittedText ? (
        <Animated.View style={[styles.textView, { opacity: fadeAnim }]}>
          <Text style={styles.text}>{submittedText}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'transparent',
    borderWidth: 0,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  textView: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
  },
});