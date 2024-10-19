import React, { useState, useEffect, useRef } from 'react';
import { Animated, TextInput, Button, View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useFonts } from "expo-font";
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
  const inputFadeAnim = useRef(new Animated.Value(1)).current;
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    Animated.timing(inputFadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      sendTextToChatGPT(text).then(response => {
        setSubmittedText(response);
        setText(''); // Clear the text input
        inputFadeAnim.setValue(1); // Reset the fade animation
      });
    });
  };

  useEffect(() => {
    if (submittedText) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
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
    }, 4000);
    setTimer(newTimer);
  };

  return (
    <ImageBackground source={require('@/assets/images/paper-background.jpg')} style={styles.background}>
      <View style={styles.container}>
        {submittedText ? (
          <Animated.View style={[styles.textView, { opacity: fadeAnim }]}>
            <Text style={styles.text}>{submittedText}</Text>
          </Animated.View>
        ) : null}
        <Animated.View style={{ opacity: inputFadeAnim, width: '100%' }}>
          <TextInput
            placeholder=""
            style={[styles.input, isFocused && styles.focusedInput && ({ outlineStyle: 'none' } as any) ]}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={text}
            underlineColorAndroid="transparent" 
            caretHidden={true}
            autoFocus={true}
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 0,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'transparent',
    borderWidth: 0,
    textAlign: 'left',
    backgroundColor: 'transparent',
    fontFamily: 'Hagrid',
    fontSize: 30,
  },
  focusedInput: {
    borderColor: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Hagrid',
    fontSize: 30,
  },
  textView: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 30,
    fontFamily: 'Aquiline', 
    backgroundColor: 'transparent',
  },
});