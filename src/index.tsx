import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {request, RESULTS} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const http = 'http://';
const https = 'https://';

const IframeTester: React.FC = () => {
  const [isHttps, setIsHttps] = useState(true);
  const [render, setRender] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    } else {
      request('ios.permission.CAMERA').then(cameraResult => {
        if (cameraResult === RESULTS.GRANTED) {
          request('ios.permission.MICROPHONE');
        }
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        contentContainerStyle={styles.keyboardInnerContainer}
        behavior={Platform?.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollInnerContainer}>
          <Text style={styles.title}>Mobile Iframe Tester</Text>
          <View style={styles.spacer} />

          <View style={styles.row}>
            <View style={styles.switchRow}>
              <Switch value={isHttps} onValueChange={setIsHttps} />

              <View style={styles.spacer} />

              <Text style={styles.protocolText}>
                <Text style={!isHttps && styles.activeProtocol}>Http</Text>/
                <Text style={isHttps && styles.activeProtocol}>Https</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setRender(true);
                setIframeUrl(inputUrl);
              }}>
              <Text style={styles.buttonText}>Render</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setRender(false);
                setIframeUrl('');
              }}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
          <TextInput
            style={styles.input}
            placeholderTextColor="#b8c9ec"
            placeholder="Input your url here"
            autoCapitalize="none"
            autoCorrect={false}
            value={inputUrl}
            onChangeText={setInputUrl}
          />

          <View style={styles.spacer} />

          <View style={styles.container}>
            {render ? (
              <WebView
                style={styles.webview}
                containerStyle={styles.webviewInnerContainer}
                cacheEnabled={false}
                incognito
                startInLoadingState
                allowsInlineMediaPlayback
                allowsFullscreenVideo
                domStorageEnabled
                useWebKit
                originWhitelist={['*']}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
                source={{uri: `${isHttps ? https : http}${iframeUrl}`}}
              />
            ) : (
              <Text style={styles.placeholderText}>
                Your website will appear here.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {backgroundColor: '#020217', flexGrow: 1},
  keyboardContainer: {flex: 1},
  keyboardInnerContainer: {flexGrow: 1},
  scrollContainer: {flexGrow: 1},
  scrollInnerContainer: {flexGrow: 1, padding: 16},
  spacer: {width: 16, height: 16},
  title: {color: '#fff', fontSize: 28, fontWeight: 'bold'},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  switchRow: {flexDirection: 'row', alignItems: 'center'},
  protocolText: {color: '#ccc', fontSize: 18, fontWeight: '600'},
  activeProtocol: {color: '#4ade80'},
  button: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#5b5fd6',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  input: {
    color: '#f1f2f3',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#7a7ee5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#b7bdf3',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  webview: {flexGrow: 1},
  webviewInnerContainer: {
    flexGrow: 1,
    minHeight: 100,
    minWidth: 100,
    borderRadius: 8,
  },
});

export {IframeTester};
