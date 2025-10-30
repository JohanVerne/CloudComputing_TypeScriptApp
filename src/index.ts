//import { helloWorld } from './hello-world';

//const greet = helloWorld();
//console.log(greet);

// index.ts
import { ISystemInformation } from './sys-info';
import express, { Request, Response } from 'express';

export const app = express();
const port = 8000;

export async function getSystemInformation(): Promise<ISystemInformation> {
  const si = await import('systeminformation');

  const cpu = await si.cpu();
  const system = await si.system();
  const mem = await si.mem();
  const os = await si.osInfo();
  const currentLoad = await si.currentLoad();
  const processes = await si.processes();
  const diskLayout = await si.diskLayout();
  const networkInterfaces = await si.networkInterfaces();

  return {
    cpu,
    system,
    mem,
    os,
    currentLoad,
    processes,
    diskLayout,
    networkInterfaces,
  };
}

// Export route handlers for testing
export async function sysinfoHandler(req: Request, res: Response) {
  try {
    const sysInfo = await getSystemInformation();
    res.json(sysInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve system information' });
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).send('Not Found');
}

// Set up routes
app.get('/api/v1/sysinfo', sysinfoHandler);
app.use(notFoundHandler);

// Start server only if run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
