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

export type RuntimeSystemSettings = {
  contact: {
    whatsappNumber: string;
  };
  email: {
    mailFrom: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
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
