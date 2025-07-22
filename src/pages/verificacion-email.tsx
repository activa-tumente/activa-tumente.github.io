import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const VerificacionEmail = () => {
  return (
    <>
      <Head>
        <title>Verificación de Email | BULLS</title>
      </Head>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/Login background.jpg)' }}
      >
        <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-white">BULLS</h1>
              <p className="text-gray-200 mt-2">Sistema de Detección de Bullying</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifica tu correo electrónico
                </h2>
                <p className="text-gray-600 mb-6">
                  Hemos enviado un enlace de verificación a tu correo electrónico. 
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-800 p-4 mb-6 text-left">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link href="/login">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800">
                    Volver al inicio de sesión
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificacionEmail;
