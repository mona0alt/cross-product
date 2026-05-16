export type SystemSettingInputType = 'text' | 'password' | 'number' | 'url';

export type SystemSettingField = {
  key: string;
  label: string;
  value: string;
  inputType: SystemSettingInputType;
  configured: boolean;
  editable: boolean;
  sensitive?: boolean;
  placeholder?: string;
  help?: string;
};

export type SystemSettingGroup = {
  key: string;
  title: string;
  description: string;
  fields: SystemSettingField[];
};

export type SystemSettingsViewModel = {
  groups: SystemSettingGroup[];
};

export type DatabaseConnectionTestResult = {
  ok: boolean;
  provider: string;
  configured: boolean;
  latencyMs: number;
  checkedAt: string;
  error?: 'DATABASE_URL_NOT_CONFIGURED' | 'DATABASE_CONNECTION_FAILED';
};

export type SmtpConnectionTestResult = {
  ok: boolean;
  host: string;
  port: number;
  configured: boolean;
  secure: boolean;
  latencyMs: number;
  checkedAt: string;
  error?:
    | 'SMTP_NOT_CONFIGURED'
    | 'SMTP_TLS_CERTIFICATE_FAILED'
    | 'SMTP_AUTH_FAILED'
    | 'SMTP_CONNECT_TIMEOUT'
    | 'SMTP_CONNECTION_FAILED';
};

export type RuntimeSystemSettings = {
  contact: {
    whatsappNumber: string;
  };
  email: {
    mailFrom: string;
    smtpHost: string;
    smtpPort: number;
    smtpPassword: string;
  };
  llm: {
    provider: string;
    model: string;
    apiBaseUrl: string;
    apiKey: string;
  };
  upload: {
    productSegment: string;
    categorySegment: string;
    bannerSegment: string;
  };
};
