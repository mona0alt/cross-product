import { revalidatePath } from 'next/cache';
import net from 'node:net';
import tls from 'node:tls';

import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import type {
  DatabaseConnectionTestResult,
  RuntimeSystemSettings,
  SmtpConnectionTestResult,
  SystemSettingField,
  SystemSettingGroup,
  SystemSettingInputType,
  SystemSettingsViewModel
} from '@/features/admin/system-settings-types';

type EditableSettingDefinition = {
  key: string;
  groupKey: string;
  label: string;
  inputType: SystemSettingInputType;
  sensitive?: boolean;
  envKey?: string;
  defaultValue: string;
  help?: string;
};

type SmtpSocket = net.Socket | tls.TLSSocket;

export function getSmtpTlsConnectionOptions(host: string) {
  return {
    servername: host,
    rejectUnauthorized: false
  };
}

export function isImplicitTlsSmtpPort(port: number) {
  return port === 465 || port === 994;
}

const editableSettingDefinitions: EditableSettingDefinition[] = [
  {
    key: 'contact.whatsappNumber',
    groupKey: 'contact',
    label: 'WhatsApp 号码',
    inputType: 'text',
    envKey: 'WHATSAPP_NUMBER',
    defaultValue: '15551234567',
    help: '前台页头、悬浮按钮、联系页和商品详情页都会读取这个号码。'
  },
  {
    key: 'email.mailFrom',
    groupKey: 'email',
    label: '发件邮箱',
    inputType: 'text',
    envKey: 'MAIL_FROM',
    defaultValue: 'support@fbgm.com',
    help: '邮件群发时使用的 From 地址，同时作为 SMTP 登录账号。'
  },
  {
    key: 'email.smtpHost',
    groupKey: 'email',
    label: 'SMTP 主机',
    inputType: 'text',
    envKey: 'SMTP_HOST',
    defaultValue: ''
  },
  {
    key: 'email.smtpPort',
    groupKey: 'email',
    label: 'SMTP 端口',
    inputType: 'number',
    envKey: 'SMTP_PORT',
    defaultValue: '465'
  },
  {
    key: 'email.smtpPassword',
    groupKey: 'email',
    label: 'SMTP 密码',
    inputType: 'password',
    sensitive: true,
    envKey: 'SMTP_PASSWORD',
    defaultValue: '',
    help: '已配置时留空保存不会覆盖现有密钥。'
  },
  {
    key: 'upload.productSegment',
    groupKey: 'upload',
    label: '商品图片目录',
    inputType: 'text',
    defaultValue: 'products',
    help: '相对于 /public/uploads，例如 products 或 catalog/products。'
  },
  {
    key: 'upload.categorySegment',
    groupKey: 'upload',
    label: '分类图片目录',
    inputType: 'text',
    defaultValue: 'categories'
  },
  {
    key: 'upload.bannerSegment',
    groupKey: 'upload',
    label: '轮播图目录',
    inputType: 'text',
    defaultValue: 'banners'
  },
  {
    key: 'llm.provider',
    groupKey: 'llm',
    label: '服务商',
    inputType: 'text',
    envKey: 'LLM_PROVIDER',
    defaultValue: 'OpenAI compatible'
  },
  {
    key: 'llm.model',
    groupKey: 'llm',
    label: '模型名',
    inputType: 'text',
    envKey: 'LLM_MODEL',
    defaultValue: 'gpt-4o-mini'
  },
  {
    key: 'llm.apiBaseUrl',
    groupKey: 'llm',
    label: 'API 地址',
    inputType: 'url',
    envKey: 'OPENAI_BASE_URL',
    defaultValue: 'https://api.openai.com/v1'
  },
  {
    key: 'llm.apiKey',
    groupKey: 'llm',
    label: 'OPENAI_API_KEY',
    inputType: 'password',
    sensitive: true,
    envKey: 'OPENAI_API_KEY',
    defaultValue: '',
    help: '密钥只保存配置状态，不在页面明文回显。'
  }
];

const groupMeta: Record<string, Omit<SystemSettingGroup, 'fields'>> = {
  contact: {
    key: 'contact',
    title: '联系配置',
    description: '前台对外联系入口使用的号码配置。'
  },
  email: {
    key: 'email',
    title: '邮箱配置',
    description: '邮件订阅、群发和自动化通知使用的 SMTP 配置。'
  },
  upload: {
    key: 'upload',
    title: '本地存储路径',
    description: '后台上传图片保存到 public/uploads 下的业务目录。'
  },
  llm: {
    key: 'llm',
    title: '大模型相关配置',
    description: 'AI 服务商、模型和接口密钥配置。'
  },
  database: {
    key: 'database',
    title: '数据库配置',
    description: '数据库连接由部署环境控制，这里只展示当前状态。'
  }
};

function getEnvironmentValue(definition: EditableSettingDefinition) {
  if (!definition.envKey) {
    return '';
  }

  return process.env[definition.envKey]?.trim() ?? '';
}

function getDefinitionFallback(definition: EditableSettingDefinition) {
  return getEnvironmentValue(definition) || definition.defaultValue;
}

function getPersistedValue(
  settings: Map<string, string>,
  definition: EditableSettingDefinition
) {
  return settings.get(definition.key)?.trim() || getDefinitionFallback(definition);
}

function normalizeUploadSegment(value: string, fallback: string) {
  const normalized = value.trim().replace(/^\/+|\/+$/g, '');

  if (
    !normalized ||
    normalized.includes('..') ||
    !/^[A-Za-z0-9/_-]+$/.test(normalized)
  ) {
    return fallback;
  }

  return normalized;
}

function normalizeEditableValue(
  definition: EditableSettingDefinition,
  value: string
) {
  const trimmed = value.trim();

  if (definition.key === 'email.smtpPort') {
    const port = Number(trimmed || definition.defaultValue);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('INVALID_SMTP_PORT');
    }

    return String(port);
  }

  if (definition.key.startsWith('upload.')) {
    return normalizeUploadSegment(trimmed, definition.defaultValue);
  }

  return trimmed;
}

async function getPersistedSettingsMap() {
  const systemSettingClient = (
    db as typeof db & {
      systemSetting?: {
        findMany: () => Promise<Array<{ key: string; value: string }>>;
      };
    }
  ).systemSetting;

  if (!systemSettingClient) {
    return new Map<string, string>();
  }

  const settings = await systemSettingClient.findMany();

  return new Map(settings.map((setting) => [setting.key, setting.value]));
}

function buildEditableField(
  settings: Map<string, string>,
  definition: EditableSettingDefinition
): SystemSettingField {
  const persistedValue = settings.get(definition.key)?.trim();
  const fallbackValue = getDefinitionFallback(definition);
  const configured = Boolean(persistedValue || fallbackValue);
  const value = definition.sensitive ? '' : persistedValue || fallbackValue;

  return {
    key: definition.key,
    label: definition.label,
    value,
    inputType: definition.inputType,
    configured,
    editable: true,
    sensitive: definition.sensitive,
    placeholder: definition.sensitive && configured ? '已配置，留空不修改' : undefined,
    help: definition.help
  };
}

export function getDatabaseProvider(databaseUrl: string) {
  if (databaseUrl.startsWith('postgres')) {
    return 'PostgreSQL';
  }

  if (databaseUrl.startsWith('mysql')) {
    return 'MySQL';
  }

  if (databaseUrl.startsWith('file:')) {
    return 'SQLite';
  }

  return databaseUrl ? '自定义数据库' : '未配置';
}

function getRuntimeGroup(): SystemSettingGroup {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';

  return {
    ...groupMeta.database,
    fields: [
      {
        key: 'runtime.databaseProvider',
        label: '数据库类型',
        value: getDatabaseProvider(databaseUrl),
        inputType: 'text',
        configured: Boolean(databaseUrl),
        editable: false
      },
      {
        key: 'runtime.databaseUrl',
        label: '连接地址',
        value: databaseUrl ? '已配置' : '未配置',
        inputType: 'text',
        configured: Boolean(databaseUrl),
        editable: false,
        sensitive: true,
        help: '数据库连接需要通过部署环境变量 DATABASE_URL 修改。'
      }
    ]
  };
}

export async function getAdminSystemSettingsViewModel(): Promise<SystemSettingsViewModel> {
  const settings = await getPersistedSettingsMap();
  const groups = ['email', 'contact', 'upload', 'llm'].map((groupKey) => ({
    ...groupMeta[groupKey],
    fields: editableSettingDefinitions
      .filter((definition) => definition.groupKey === groupKey)
      .map((definition) => buildEditableField(settings, definition))
  }));

  return {
    groups: [...groups.slice(0, 3), getRuntimeGroup(), groups[3]]
  };
}

export async function testCurrentDatabaseConnection(): Promise<DatabaseConnectionTestResult> {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  const startedAt = Date.now();
  const baseResult = {
    provider: getDatabaseProvider(databaseUrl),
    configured: Boolean(databaseUrl)
  };

  if (!databaseUrl) {
    return {
      ...baseResult,
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error: 'DATABASE_URL_NOT_CONFIGURED'
    };
  }

  try {
    await db.$queryRaw`SELECT 1`;

    return {
      ...baseResult,
      ok: true,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString()
    };
  } catch {
    return {
      ...baseResult,
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error: 'DATABASE_CONNECTION_FAILED'
    };
  }
}

function readSmtpResponse(socket: SmtpSocket) {
  return new Promise<{ code: number; message: string }>((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('SMTP_RESPONSE_TIMEOUT'));
    }, 15000);

    function cleanup() {
      clearTimeout(timer);
      socket.off('data', onData);
      socket.off('error', onError);
    }

    function onError(error: Error) {
      cleanup();
      reject(error);
    }

    function onData(chunk: Buffer) {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);
      const match = lastLine?.match(/^(\d{3})\s/);

      if (!match) {
        return;
      }

      cleanup();
      resolve({
        code: Number(match[1]),
        message: buffer.trim()
      });
    }

    socket.on('data', onData);
    socket.on('error', onError);
  });
}

async function expectSmtpResponse(socket: SmtpSocket, expectedCodes: number | number[]) {
  const expected = Array.isArray(expectedCodes) ? expectedCodes : [expectedCodes];
  const response = await readSmtpResponse(socket);

  if (!expected.includes(response.code)) {
    throw new Error(response.message || `SMTP_UNEXPECTED_${response.code}`);
  }

  return response;
}

async function sendSmtpCommand(
  socket: SmtpSocket,
  command: string,
  expectedCodes: number | number[]
) {
  socket.write(`${command}\r\n`);

  return expectSmtpResponse(socket, expectedCodes);
}

function connectSmtp({
  host,
  port,
  secure
}: {
  host: string;
  port: number;
  secure: boolean;
}) {
  return new Promise<SmtpSocket>((resolve, reject) => {
    const socket = secure
      ? tls.connect({
          host,
          port,
          ...getSmtpTlsConnectionOptions(host)
        })
      : net.connect({
          host,
          port
        });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error('SMTP_CONNECT_TIMEOUT'));
    }, 15000);

    socket.once(secure ? 'secureConnect' : 'connect', () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function upgradeSmtpToTls(socket: net.Socket, host: string) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const tlsSocket = tls.connect({
      socket,
      ...getSmtpTlsConnectionOptions(host)
    });

    tlsSocket.once('secureConnect', () => resolve(tlsSocket));
    tlsSocket.once('error', reject);
  });
}

async function verifySmtpCredentials({
  host,
  port,
  user,
  pass,
  secure
}: {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}) {
  let socket = await connectSmtp({ host, port, secure });

  try {
    await expectSmtpResponse(socket, 220);
    await sendSmtpCommand(socket, 'EHLO localhost', 250);

    if (!secure) {
      await sendSmtpCommand(socket, 'STARTTLS', 220);
      socket = await upgradeSmtpToTls(socket as net.Socket, host);
      await sendSmtpCommand(socket, 'EHLO localhost', 250);
    }

    await sendSmtpCommand(socket, 'AUTH LOGIN', 334);
    await sendSmtpCommand(socket, Buffer.from(user).toString('base64'), 334);
    await sendSmtpCommand(socket, Buffer.from(pass).toString('base64'), 235);
    socket.write('QUIT\r\n');
  } finally {
    socket.end();
  }
}

export function getSmtpConnectionErrorCode(error: unknown): SmtpConnectionTestResult['error'] {
  if (!(error instanceof Error)) {
    return 'SMTP_CONNECTION_FAILED';
  }

  const message = error.message.toLowerCase();
  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';

  if (code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || code.includes('CERT') || message.includes('certificate')) {
    return 'SMTP_TLS_CERTIFICATE_FAILED';
  }

  if (message.includes('smtp_connect_timeout') || message.includes('timeout')) {
    return 'SMTP_CONNECT_TIMEOUT';
  }

  if (message.startsWith('535') || message.includes('authentication') || message.includes('auth')) {
    return 'SMTP_AUTH_FAILED';
  }

  return 'SMTP_CONNECTION_FAILED';
}

export async function testCurrentSmtpConnection(): Promise<SmtpConnectionTestResult> {
  const settings = await getRuntimeSystemSettings();
  const host = settings.email.smtpHost.trim();
  const port = settings.email.smtpPort;
  const user = settings.email.mailFrom.trim();
  const pass = settings.email.smtpPassword.trim();
  const secure = isImplicitTlsSmtpPort(port);
  const startedAt = Date.now();
  const baseResult = {
    host,
    port,
    configured: Boolean(host && user && pass && Number.isFinite(port)),
    secure
  };

  if (!baseResult.configured) {
    return {
      ...baseResult,
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error: 'SMTP_NOT_CONFIGURED'
    };
  }

  try {
    await verifySmtpCredentials({ host, port, user, pass, secure });

    return {
      ...baseResult,
      ok: true,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      ...baseResult,
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      error: getSmtpConnectionErrorCode(error)
    };
  }
}

export async function getRuntimeSystemSettings(): Promise<RuntimeSystemSettings> {
  const settings = await getPersistedSettingsMap();

  const getValue = (key: string) => {
    const definition = editableSettingDefinitions.find((item) => item.key === key);

    if (!definition) {
      return '';
    }

    return getPersistedValue(settings, definition);
  };

  const mailFrom = getValue('email.mailFrom');

  return {
    contact: {
      whatsappNumber: getValue('contact.whatsappNumber')
    },
    email: {
      mailFrom,
      smtpHost: getValue('email.smtpHost'),
      smtpPort: Number(getValue('email.smtpPort') || 465),
      smtpPassword: getValue('email.smtpPassword')
    },
    llm: {
      provider: getValue('llm.provider'),
      model: getValue('llm.model'),
      apiBaseUrl: getValue('llm.apiBaseUrl'),
      apiKey: getValue('llm.apiKey')
    },
    upload: {
      productSegment: normalizeUploadSegment(getValue('upload.productSegment'), 'products'),
      categorySegment: normalizeUploadSegment(getValue('upload.categorySegment'), 'categories'),
      bannerSegment: normalizeUploadSegment(getValue('upload.bannerSegment'), 'banners')
    }
  };
}

export async function updateAdminSystemSettings(
  previousStateOrFormData: FormData | { ok?: boolean; error?: string },
  maybeFormData?: FormData
) {
  'use server';

  await requireAdminSession();
  const formData =
    maybeFormData ?? (previousStateOrFormData instanceof FormData ? previousStateOrFormData : null);

  if (!formData) {
    return { ok: false, error: 'INVALID_FORM_DATA' };
  }

  const writes = editableSettingDefinitions.flatMap((definition) => {
    const rawValue = formData.get(definition.key);
    const value = typeof rawValue === 'string' ? rawValue : '';

    if (definition.sensitive && value.trim().length === 0) {
      return [];
    }

    const normalizedValue = normalizeEditableValue(definition, value);

    return db.systemSetting.upsert({
      where: { key: definition.key },
      update: { value: normalizedValue },
      create: {
        key: definition.key,
        value: normalizedValue
      }
    });
  });

  await Promise.all(writes);
  revalidatePath('/admin/categories');
  revalidatePath('/');

  return { ok: true };
}
