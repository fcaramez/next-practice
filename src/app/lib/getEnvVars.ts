export const getEnvVars = () => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

  return { TOKEN_SECRET };
};
