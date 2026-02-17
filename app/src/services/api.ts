import { ENV } from '../config/env';

export type HealthResult = {
  status: number;
  body: string;
  endpoint: string;
};

export type AnamneseStartResponse = {
  session_id: string;
  step: number;
  done: false;
  message: string;
};

export type AnamneseProfile = {
  goal: string;
  age: number;
  sex: 'male' | 'female' | 'other' | 'unknown';
  weight_kg: number;
  height_cm: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'high';
  restrictions: string[];
};

export type AnamneseDoneResponse = {
  session_id: string;
  done: true;
  profile: AnamneseProfile;
  bmi: number;
  bmi_category: string;
  summary: string;
};

export type AnamneseNextResponse = {
  session_id: string;
  step: number;
  done: false;
  message: string;
};

export type AnamneseAnswerResponse = AnamneseNextResponse | AnamneseDoneResponse;

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

function resolveBaseUrl(apiUrl?: string): string {
  const baseUrl = (apiUrl ?? ENV.API_URL).trim().replace(/\/$/, '');

  if (!baseUrl || baseUrl.includes('example.com')) {
    throw new ApiError('API_URL não configurada. Defina uma URL válida da sua API no app.config.ts/.env e reinicie o Expo.');
  }

  return baseUrl;
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${resolveBaseUrl()}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    const rawBody = await response.text();
    let parsedBody: unknown;

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }
    }

    if (!response.ok) {
      const detail =
        typeof parsedBody === 'object' && parsedBody && 'detail' in parsedBody
          ? String((parsedBody as Record<string, unknown>).detail)
          : typeof parsedBody === 'object' && parsedBody && 'message' in parsedBody
            ? String((parsedBody as Record<string, unknown>).message)
            : undefined;

      throw new ApiError(
        detail || 'Não foi possível concluir a solicitação. Tente novamente.',
        response.status,
      );
    }

    return parsedBody as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('A conexão demorou demais. Tente novamente em instantes.');
    }

    throw new ApiError('Não foi possível conectar com o servidor da anamnese. Verifique a API_URL e sua conexão e tente de novo.');
  } finally {
    clearTimeout(timeout);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

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

export async function startAnamnese(language = 'pt-BR'): Promise<AnamneseStartResponse> {
  return requestJson<AnamneseStartResponse>('/v1/anamnese/start', {
    method: 'POST',
    body: JSON.stringify({ language }),
  });
}

export async function answerAnamnese(
  sessionId: string,
  answer: string,
): Promise<AnamneseAnswerResponse> {
  return requestJson<AnamneseAnswerResponse>('/v1/anamnese/answer', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      answer,
    }),
  });
}