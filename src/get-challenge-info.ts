/**
 * Get challenge info tool
 */

import {
  errorResponse,
  jsonResponse,
  type ExtensionToolDefinition,
} from '@jshookmcp/extension-sdk/plugin';

export const getChallengeInfoTool: ExtensionToolDefinition = {
  name: 'ctf_get_challenge_info',
  description: 'Get information about a CTF challenge',
  schema: {
    type: 'object',
    properties: {
      platform: {
        type: 'string',
        enum: ['ctfd', 'fbctf', 'custom'],
        description: 'CTF platform type',
      },
      baseUrl: {
        type: 'string',
        description: 'Platform base URL',
      },
      apiKey: {
        type: 'string',
        description: 'API key for authentication',
      },
      challengeId: {
        type: 'string',
        description: 'Challenge ID',
      },
    },
    required: ['platform', 'baseUrl', 'apiKey', 'challengeId'],
  },
  handler: async (args, _ctx) => {
    try {
      const platform = args.platform as string;
      const baseUrl = args.baseUrl as string;
      const apiKey = args.apiKey as string;
      const challengeId = args.challengeId as string;

      if (!platform || !baseUrl || !apiKey || !challengeId) {
        return errorResponse('ctf_get_challenge_info', 'Missing required arguments');
      }

      let url: string;
      let headers: Record<string, string>;

      switch (platform) {
        case 'ctfd': {
          url = `${baseUrl}/api/v1/challenges/${challengeId}`;
          headers = { Authorization: `Token ${apiKey}` };
          break;
        }
        case 'fbctf': {
          url = `${baseUrl}/api/v1/challenges/${challengeId}`;
          headers = { 'X-FBCTF-APIKey': apiKey };
          break;
        }
        case 'custom': {
          url = `${baseUrl}/api/challenges/${challengeId}`;
          headers = { Authorization: `Bearer ${apiKey}` };
          break;
        }
        default:
          return errorResponse('ctf_get_challenge_info', `Unknown platform: ${platform}`);
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      return jsonResponse({
        success: response.ok,
        status: response.status,
        challenge: data.data || data,
      });
    } catch (error) {
      return errorResponse('ctf_get_challenge_info', error);
    }
  },
};
