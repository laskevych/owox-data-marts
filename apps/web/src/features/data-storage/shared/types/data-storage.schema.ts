import { z } from 'zod';
import { DataStorageType } from '../model/types';

const googleCredentialsSchema = z.object({
  serviceAccount: z
    .string()
    .min(1, 'Service Account Key is required')
    .transform((str, ctx) => {
      try {
        const parsed = JSON.parse(str) as { client_email: string; private_key: string };

        if (typeof parsed !== 'object') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Service Account must be a valid JSON object',
          });
          return z.NEVER;
        }

        if (!parsed.client_email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Service Account must contain a client_email field',
          });
          return z.NEVER;
        }

        if (!parsed.private_key) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Service Account must contain a private_key field',
          });
          return z.NEVER;
        }

        return str;
      } catch (e) {
        console.error(e);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Service Account must be a valid JSON string',
        });
        return z.NEVER;
      }
    }),
});

const awsCredentialsSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
});

const googleConfigSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  location: z.string().min(1, 'Location is required'),
});

const awsConfigSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  outputBucket: z.string().min(1, 'Output Bucket is required'),
  databaseName: z.string().min(1, 'Database Name is required'),
});

const baseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
});

export const googleBigQuerySchema = baseSchema.extend({
  type: z.literal(DataStorageType.GOOGLE_BIGQUERY),
  credentials: googleCredentialsSchema,
  config: googleConfigSchema,
});

export const awsAthenaSchema = baseSchema.extend({
  type: z.literal(DataStorageType.AWS_ATHENA),
  credentials: awsCredentialsSchema,
  config: awsConfigSchema,
});

export const dataStorageSchema = z.discriminatedUnion('type', [
  googleBigQuerySchema,
  awsAthenaSchema,
]);

export type DataStorageFormData = z.infer<typeof dataStorageSchema>;
export type GoogleBigQueryFormData = z.infer<typeof googleBigQuerySchema>;
export type AwsAthenaFormData = z.infer<typeof awsAthenaSchema>;
