export type HealthResult = {
  status: number;
  body: string;
  endpoint: string;
};

export async function testApiHealth(apiUrl: string): Promise<HealthResult> {
  const endpoint = `${apiUrl.replace(/\/$/, '')}/health`;

  try {
    const response = await fetch(endpoint);
    const body = await response.text();

    return {
      status: response.status,
      body,
      endpoint,
    };
  } catch {
    throw new Error(
      'Não foi possível conectar na API. Verifique a URL e sua conexão de rede.',
    );
  }
}