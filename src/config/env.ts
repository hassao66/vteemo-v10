const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export function validateEnv(): void {
  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

export const env = {
  supabaseUrl: requiredEnvVars.VITE_SUPABASE_URL!,
  supabaseAnonKey: requiredEnvVars.VITE_SUPABASE_ANON_KEY!,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
