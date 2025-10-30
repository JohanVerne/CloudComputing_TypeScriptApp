import { Request, Response } from 'express';
import * as indexModule from './index';

// Mock Express Request
const mockRequest = (data: any = {}): Partial<Request> => {
  return {
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    ...data,
  };
};

// Mock Express Response with chainable methods
const mockResponse = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('getSystemInformation', () => {
  it('should return system information with all required properties', async () => {
    const sysInfo = await indexModule.getSystemInformation();

    expect(sysInfo).toHaveProperty('cpu');
    expect(sysInfo).toHaveProperty('system');
    expect(sysInfo).toHaveProperty('mem');
    expect(sysInfo).toHaveProperty('os');
    expect(sysInfo).toHaveProperty('currentLoad');
    expect(sysInfo).toHaveProperty('processes');
    expect(sysInfo).toHaveProperty('diskLayout');
    expect(sysInfo).toHaveProperty('networkInterfaces');
  });

  it('should return valid cpu data', async () => {
    const sysInfo = await indexModule.getSystemInformation();
    expect(sysInfo.cpu).toBeDefined();
    expect(typeof sysInfo.cpu).toBe('object');
  });

  it('should return valid memory data', async () => {
    const sysInfo = await indexModule.getSystemInformation();
    expect(sysInfo.mem).toBeDefined();
    expect(sysInfo.mem).toHaveProperty('total');
  });
});

describe('sysinfoHandler - GET /api/v1/sysinfo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 200 and system info JSON', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await indexModule.sysinfoHandler(req as Request, res as Response);

    expect(res.json).toHaveBeenCalled();
    const callArg = (res.json as jest.Mock).mock.calls[0][0];
    expect(callArg).toHaveProperty('cpu');
    expect(callArg).toHaveProperty('system');
    expect(callArg).toHaveProperty('mem');
  });
});

describe('notFoundHandler - 404 routes', () => {
  it('should return 404 status and "Not Found" message', () => {
    const req = mockRequest();
    const res = mockResponse();

    indexModule.notFoundHandler(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Not Found');
  });

  it('should handle any unknown path', () => {
    const req = mockRequest({ path: '/unknown/path' });
    const res = mockResponse();

    indexModule.notFoundHandler(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
