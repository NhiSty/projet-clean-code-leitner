/**
 * @fileoverview This is the entry point for our backend server.
 */

import { createServer } from './server.js'

// Create a new server instance and start it
const server = await createServer(8080)
await server.initialize()
await server.start()