interface EnvConfig {
    apiUrl: string;
  }
  
  interface Window {
    __env: EnvConfig;
  }
  