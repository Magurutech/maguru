import { setupServer } from 'msw/node'
import { handlers } from './msw-handlers'

/**
 * Setup MSW server untuk mocking API calls dalam integration test
 */
export const server = setupServer(...handlers)

// Konfigurasi server untuk pengujian
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
