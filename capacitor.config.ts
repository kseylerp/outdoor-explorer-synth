
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.12b67abbbe144abd9666bb7f67995795',
  appName: 'outdoor-explorer-synth',
  webDir: 'dist',
  server: {
    url: 'https://12b67abb-be14-4abd-9666-bb7f67995795.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
