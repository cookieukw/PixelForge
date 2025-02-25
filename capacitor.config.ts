import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cookieukw.pixelforge',
  appName: 'com.cookieukw.pixelforge',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#2d2b30', // Cor da status bar
    statusBar: {
      style: 'dark',
      overlay: false,
      backgroundColor: '#2d2b30'
    }
  }
};



export default config;
