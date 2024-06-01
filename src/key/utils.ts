import * as bcrypt from 'bcrypt';

export const hashApiKey = async (apiKey: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(apiKey, saltRounds);
};

export const compareApiKey = async (apiKey: string, hashedApiKey: string): Promise<boolean> => {
  const trimmedApiKey = apiKey.trim();
  const trimmedHashedApiKey = hashedApiKey.trim();
  return await bcrypt.compare(trimmedApiKey, trimmedHashedApiKey);
};
