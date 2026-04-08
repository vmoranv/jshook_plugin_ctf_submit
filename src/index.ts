/**
 * CTF Flag Auto-Submission Plugin
 *
 * Supports: CTFd, fbctf, and custom platforms
 */

import { createExtension } from '@jshookmcp/extension-sdk/plugin';
import { submitFlagTool } from './submit-flag.js';
import { getChallengeInfoTool } from './get-challenge-info.js';

export default createExtension('jshook-plugin-ctf-submit', '0.1.0')
  .description('Auto-submit CTF flags to CTFd/fbctf/custom platforms')
  .compatibleCore('>=0.2.0')
  .profile('workflow')
  .tool(
    submitFlagTool.name,
    submitFlagTool.description,
    submitFlagTool.schema.properties as Record<string, unknown>,
    submitFlagTool.handler,
    ['workflow'],
  )
  .tool(
    getChallengeInfoTool.name,
    getChallengeInfoTool.description,
    getChallengeInfoTool.schema.properties as Record<string, unknown>,
    getChallengeInfoTool.handler,
    ['workflow'],
  );
