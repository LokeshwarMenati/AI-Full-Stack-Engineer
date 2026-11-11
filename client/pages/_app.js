import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import PrototypeBanner from '../components/PrototypeBanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Head>
          <title>JANASEVA AI – Public Grievance & Governance Platform</title>
          <meta name="description" content="Intelligent Public Grievance Redressal and Governance Platform for Citizen Empowerment (Recruitment Prototype)." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
          <PrototypeBanner />
          <Navbar />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
