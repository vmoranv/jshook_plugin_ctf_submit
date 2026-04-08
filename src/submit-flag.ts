/**
 * Submit CTF flag tool
 */

import {
  errorResponse,
  jsonResponse,
  type ExtensionToolDefinition,
} from '@jshookmcp/extension-sdk/plugin';

export const submitFlagTool: ExtensionToolDefinition = {
  name: 'ctf_submit_flag',
  description: 'Submit a CTF flag to the specified platform',
  schema: {
    platform: {
      type: 'string',
      enum: ['ctfd', 'fbctf', 'custom'],
      description: 'CTF platform type',
    },
    baseUrl: {
      type: 'string',
      description: 'Platform base URL (e.g., https://ctfd.example.com)',
    },
    apiKey: {
      type: 'string',
      description: 'API key or token for authentication',
    },
    challengeId: {
      type: 'string',
      description: 'Challenge ID to submit the flag for',
    },
    flag: {
      type: 'string',
      description: 'The flag value to submit',
    },
  },
  handler: async (args, _ctx) => {
    try {
      const platform = args.platform as string;
      const baseUrl = args.baseUrl as string;
      const apiKey = args.apiKey as string;
      const challengeId = args.challengeId as string;
      const flag = args.flag as string;

      if (!platform || !baseUrl || !apiKey || !challengeId || !flag) {
        return errorResponse('ctf_submit_flag', 'Missing required arguments');
      }

      let url: string;
      let body: Record<string, unknown>;
      let headers: Record<string, string>;

      switch (platform) {
        case 'ctfd': {
          url = `${baseUrl}/api/v1/challenges/${challengeId}/solves`;
          body = { flag };
          headers = {
            Authorization: `Token ${apiKey}`,
            'Content-Type': 'application/json',
          };
          break;
        }
        case 'fbctf': {
          url = `${baseUrl}/api/v1/team/submissions`;
          body = { challenge_id: challengeId, flag };
          headers = {
            'X-FBCTF-APIKey': apiKey,
            'Content-Type': 'application/json',
          };
          break;
        }
        case 'custom': {
          url = `${baseUrl}/submit`;
          body = { challenge_id: challengeId, flag };
          headers = {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          };
          break;
        }
        default:
          return errorResponse('ctf_submit_flag', `Unknown platform: ${platform}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return jsonResponse({
        success: response.ok,
        status: response.status,
        platform,
        challengeId,
        response: data,
      });
    } catch (error) {
      return errorResponse('ctf_submit_flag', error);
    }
  },
};
