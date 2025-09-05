// =============================================================================
// ⚡ OAUTH PLATFORM - CLEAN ENTRY POINT
// =============================================================================

import { Router } from './core/router.js';

export default {
  async fetch(request, env, ctx) {
    const router = new Router(env);
    return await router.handleRequest(request);
  }
};
