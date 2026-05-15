import net from 'node:net';
import tls from 'node:tls';
import { z } from 'zod';

import { getRuntimeSystemSettings } from '@/features/admin/system-settings-actions';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

const emailSchema = z.string().trim().email().transform((email) => email.toLowerCase());

const subscriberCreateSchema = z.object({
  email: emailSchema
});

const mailTemplateSchema = z.object({
  name: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  body: z.string().trim().min(1)
});

const campaignCreateSchema = z.object({
  templateId: z.string().trim().min(1),
  subject: z.string().trim().min(1).optional(),
  body: z.string().trim().min(1).optional()
});

const campaignDeleteSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1)
});

const automationSchema = z.object({
  trigger: z.enum(['product_new', 'restock', 'manual']),
  frequencyCap: z.enum(['daily', 'weekly', 'unlimited']),
  enabled: z.boolean()
});

type SubscriberRecord = {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | string;
  createdAt: Date | string;
};

type MailCampaignRecord = {
  id: string;
  templateId: string | null;
  templateName: string;
  subject: string;
  body: string;
  status: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  errorMessage: string | null;
  sentAt: Date | string | null;
  createdAt: Date | string;
};

type MailTemplateRecord = {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
};

type SmtpSocket = net.Socket | tls.TLSSocket;

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await getRuntimeSystemSettings();
  const host = settings.email.smtpHost.trim();
  const user = settings.email.smtpUser.trim();
  const pass = settings.email.smtpPassword.trim();
  const from = settings.email.mailFrom.trim() || user;
  const port = settings.email.smtpPort;

  if (!host || !user || !pass || !from || !Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: port === 465
  };
}

function getEnvelopeAddress(address: string) {
  const match = address.match(/<([^>]+)>/);

  return match?.[1] ?? address;
}

function encodeHeader(value: string) {
  return /^[\x00-\x7F]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value).toString('base64')}?=`;
}

function escapeSmtpData(value: string) {
  return value.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');
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

async function expectSmtpResponse(
  socket: SmtpSocket,
  expectedCodes: number | number[]
) {
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

function connectSmtp(config: SmtpConfig) {
  return new Promise<SmtpSocket>((resolve, reject) => {
    const socket = config.secure
      ? tls.connect({
          host: config.host,
          port: config.port,
          servername: config.host
        })
      : net.connect({
          host: config.host,
          port: config.port
        });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error('SMTP_CONNECT_TIMEOUT'));
    }, 15000);

    socket.once('connect', () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function upgradeToTls(socket: net.Socket, config: SmtpConfig) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const tlsSocket = tls.connect({
      socket,
      servername: config.host
    });

    tlsSocket.once('secureConnect', () => resolve(tlsSocket));
    tlsSocket.once('error', reject);
  });
}

async function sendSmtpMail(config: SmtpConfig, to: string, subject: string, text: string) {
  let socket = await connectSmtp(config);

  try {
    await expectSmtpResponse(socket, 220);
    await sendSmtpCommand(socket, 'EHLO localhost', 250);

    if (!config.secure) {
      await sendSmtpCommand(socket, 'STARTTLS', 220);
      socket = await upgradeToTls(socket as net.Socket, config);
      await sendSmtpCommand(socket, 'EHLO localhost', 250);
    }

    await sendSmtpCommand(socket, 'AUTH LOGIN', 334);
    await sendSmtpCommand(socket, Buffer.from(config.user).toString('base64'), 334);
    await sendSmtpCommand(socket, Buffer.from(config.pass).toString('base64'), 235);
    await sendSmtpCommand(socket, `MAIL FROM:<${getEnvelopeAddress(config.from)}>`, 250);
    await sendSmtpCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
    await sendSmtpCommand(socket, 'DATA', 354);

    const headers = [
      `From: ${config.from}`,
      `To: ${to}`,
      `Subject: ${encodeHeader(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit'
    ];

    socket.write(`${headers.join('\r\n')}\r\n\r\n${escapeSmtpData(text)}\r\n.\r\n`);
    await expectSmtpResponse(socket, 250);
    socket.write('QUIT\r\n');
  } finally {
    socket.end();
  }
}

function formatDateTime(value: Date | string | null) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value));
}

function normalizeCampaignStatus(status: string): '成功' | '部分成功' | '失败' | '待发送' {
  if (status === 'sent') {
    return '成功';
  }

  if (status === 'partial') {
    return '部分成功';
  }

  if (status === 'failed') {
    return '失败';
  }

  return '待发送';
}

export function mapSubscriberRow(subscriber: SubscriberRecord) {
  return {
    id: subscriber.id,
    email: subscriber.email,
    status: subscriber.status === 'active' ? 'active' : 'inactive',
    createdAt: subscriber.createdAt
  };
}

export function mapMailTemplate(template: MailTemplateRecord) {
  return {
    id: template.id,
    name: template.name,
    subject: template.subject,
    body: template.body,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt
  };
}

export function mapMailCampaign(campaign: MailCampaignRecord) {
  return {
    id: campaign.id,
    templateId: campaign.templateId ?? '',
    templateName: campaign.templateName,
    subject: campaign.subject,
    body: campaign.body,
    status: normalizeCampaignStatus(campaign.status),
    recipients: campaign.recipientCount,
    success: campaign.successCount,
    failed: campaign.failureCount,
    errorMessage: campaign.errorMessage,
    sentAt: formatDateTime(campaign.sentAt ?? campaign.createdAt)
  };
}

async function sendMail(to: string, subject: string, text: string) {
  const smtp = await getSmtpConfig();

  if (!smtp) {
    return {
      ok: false,
      error: 'SMTP_NOT_CONFIGURED'
    };
  }

  try {
    await sendSmtpMail(smtp, to, subject, text);

    return {
      ok: true,
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'MAIL_SEND_FAILED'
    };
  }
}

export async function createAdminSubscriber(input: unknown) {
  await requireAdminSession();
  const payload = subscriberCreateSchema.parse(input);

  const subscriber = await db.subscriber.create({
    data: {
      email: payload.email,
      source: 'admin',
      status: 'active'
    }
  });

  return mapSubscriberRow(subscriber);
}

export async function deleteAdminSubscriber(id: string) {
  await requireAdminSession();

  await db.subscriber.delete({
    where: { id }
  });
}

export async function createMailTemplate(input: unknown) {
  await requireAdminSession();
  const payload = mailTemplateSchema.parse(input);

  const template = await db.mailTemplate.create({
    data: payload
  });

  return mapMailTemplate(template);
}

export async function updateMailTemplate(id: string, input: unknown) {
  await requireAdminSession();
  const payload = mailTemplateSchema.parse(input);

  const template = await db.mailTemplate.update({
    where: { id },
    data: payload
  });

  return mapMailTemplate(template);
}

export async function deleteMailTemplate(id: string) {
  await requireAdminSession();

  await db.mailTemplate.delete({
    where: { id }
  });
}

export async function createMailCampaign(input: unknown) {
  await requireAdminSession();
  const payload = campaignCreateSchema.parse(input);
  const template = await db.mailTemplate.findUnique({
    where: { id: payload.templateId }
  });

  if (!template) {
    throw new Error('MAIL_TEMPLATE_NOT_FOUND');
  }

  const subscribers = await db.subscriber.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });
  const subject = payload.subject ?? template.subject;
  const body = payload.body ?? template.body;
  const deliveryResults = await Promise.all(
    subscribers.map(async (subscriber) => ({
      subscriber,
      result: await sendMail(subscriber.email, subject, body)
    }))
  );
  const successCount = deliveryResults.filter((delivery) => delivery.result.ok).length;
  const failureCount = deliveryResults.length - successCount;
  const status =
    failureCount === 0
      ? 'sent'
      : successCount > 0
        ? 'partial'
        : 'failed';
  const firstError =
    deliveryResults.find((delivery) => !delivery.result.ok)?.result.error ?? null;
  const sentAt = new Date();

  const campaign = await db.mailCampaign.create({
    data: {
      templateId: template.id,
      templateName: template.name,
      subject,
      body,
      status,
      recipientCount: deliveryResults.length,
      successCount,
      failureCount,
      errorMessage: firstError,
      sentAt,
      deliveries: {
        create: deliveryResults.map(({ subscriber, result }) => ({
          subscriberId: subscriber.id,
          email: subscriber.email,
          status: result.ok ? 'sent' : 'failed',
          errorMessage: result.error
        }))
      }
    }
  });

  return mapMailCampaign(campaign);
}

export async function deleteMailCampaigns(input: unknown) {
  await requireAdminSession();
  const payload = campaignDeleteSchema.parse(input);
  const uniqueIds = Array.from(new Set(payload.ids));

  const result = await db.mailCampaign.deleteMany({
    where: {
      id: {
        in: uniqueIds
      }
    }
  });

  return result.count;
}

export async function updateMailAutomationSetting(input: unknown) {
  await requireAdminSession();
  const payload = automationSchema.parse(input);

  return db.mailAutomationSetting.upsert({
    where: { singletonKey: 'default' },
    update: payload,
    create: {
      singletonKey: 'default',
      ...payload
    }
  });
}
