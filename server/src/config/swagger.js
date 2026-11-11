export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'JANASEVA AI – Grievance Redressal & Governance API',
    version: '1.0.0',
    description: 'Government-grade REST API for Public Grievance Redressal (Recruitment Prototype for WhiteMatrix Software Solutions evaluation inspired by CM Kerala grievance portal).',
    contact: {
      name: 'JANASEVA AI Platform Support',
      email: 'support@janaseva.demo'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register citizen with Dual CAPTCHA',
        tags: ['Authentication'],
        responses: { 201: { description: 'User registered successfully' } }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate citizen or administrative officer with Dual CAPTCHA',
        tags: ['Authentication'],
        responses: { 200: { description: 'Authentication successful with JWT' } }
      }
    },
    '/captcha/image': {
      get: {
        summary: 'Generate SVG image CAPTCHA challenge',
        tags: ['CAPTCHA'],
        responses: { 200: { description: 'Returns SVG and challengeId' } }
      }
    },
    '/grievances': {
      get: {
        summary: 'List grievances (filtered by role)',
        tags: ['Grievances'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of grievances' } }
      },
      post: {
        summary: 'Submit new citizen grievance',
        tags: ['Grievances'],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Grievance submitted' } }
      }
    },
    '/grievances/track/{referenceNumber}': {
      get: {
        summary: 'Track grievance progress with privacy masking',
        tags: ['Grievances'],
        responses: { 200: { description: 'Public tracking timeline' } }
      }
    },
    '/cmo/statistics': {
      get: {
        summary: 'CMO dashboard aggregation analytics',
        tags: ['CMO Administration'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Real-time aggregation stats' } }
      }
    },
    '/cmo/assign': {
      post: {
        summary: 'Assign department/officer to grievance',
        tags: ['CMO Administration'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Department assigned' } }
      }
    },
    '/officer/assigned': {
      get: {
        summary: 'Department officer grievances list',
        tags: ['Department Officer'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of assigned grievances' } }
      }
    },
    '/officer/action-report': {
      post: {
        summary: 'Submit Action-Taken Report',
        tags: ['Department Officer'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Action-taken report submitted' } }
      }
    },
    '/ai/analyze': {
      post: {
        summary: 'Analyze grievance text via Google Gemini',
        tags: ['AI Assistant'],
        responses: { 200: { description: 'AI classification & recommendations' } }
      }
    }
  }
};

