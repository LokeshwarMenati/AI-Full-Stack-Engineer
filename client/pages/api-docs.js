import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ApiDocsPage() {
  useEffect(() => {
    // Dynamically load Swagger UI CSS and JS from reliable CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js';
    script.async = true;
    script.onload = () => {
      if (window.SwaggerUIBundle) {
        window.SwaggerUIBundle({
          url: '/api/docs/spec',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          layout: 'BaseLayout'
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.head.removeChild(link);
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Head>
        <title>Swagger OpenAPI Documentation | JANASEVA AI</title>
        <meta name="description" content="Public interactive Swagger OpenAPI documentation for JANASEVA AI Grievance Platform REST APIs." />
      </Head>

      {/* Top Bar Header */}
      <div className="bg-[#0A2E24] text-white py-4 px-4 sm:px-8 border-b border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition bg-emerald-900/80 px-3 py-1.5 rounded-lg border border-emerald-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portal
          </Link>
          <div className="h-4 w-px bg-emerald-800"></div>
          <span className="text-sm font-bold font-serif text-white tracking-wide">
            JANASEVA AI • Interactive OpenAPI 3.0 Documentation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Live Production API
          </span>
          <a
            href="/api/docs/spec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
          >
            Raw JSON Spec <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden">
          <div id="swagger-ui" className="min-h-[600px]">
            <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
              Loading interactive OpenAPI Swagger UI documentation...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
