import React, { useState } from 'react';
import { Image, StyleSheet, Platform, TextInput, Button, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { sendTextToChatGPT } from '@/api/chatgpt';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleSubmit = () => {
    sendTextToChatGPT(text).then(setSubmittedText);
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <TextInput
        placeholder="Enter text here"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={setText}
        value={text}
      />
      <Button title="Submit" onPress={handleSubmit} />
      {submittedText ? (
        <View style={styles.textView}>
          <Text style={styles.text}>{submittedText}</Text>
        </View>
      ) : null}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    width: 100,
    height: 100,
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
