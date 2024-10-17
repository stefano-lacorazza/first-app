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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter text here"
        style={styles.input}
        onChangeText={setText}
        value={text}
      />
      <Button title="Submit" onPress={handleSubmit} />
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
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