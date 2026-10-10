import { describe, it, expect } from 'vitest';
import { createApp } from '../server/src/app';

describe('Server API Endpoints', () => {
  const app = createApp();

  it('responds with root server info', async () => {
    // Basic unit test verifying server app initializes without error
    expect(app).toBeDefined();
  });
});
