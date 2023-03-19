import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document(): JSX.Element {
  return (
    <Html lang='en'>
      <Head />

      <body className='container-fluid'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}