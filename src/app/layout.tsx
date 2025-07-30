"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Toaster } from 'react-hot-toast';

import Nav from "./_component/Nav/Nav";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ThemeProvider theme={theme}>
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
        <Provider store={store}>
          <Nav/>
          {children}
          
          <Toaster/>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
    </ThemeProvider>
  );
}
