import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, App } from "antd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meeting Notes - Premium Dashboard",
  description: "Modern meeting management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 12,
                colorBgLayout: '#f9fafb',
                colorBgContainer: '#ffffff',
                colorTextHeading: '#111827',
                colorText: '#374151',
                fontFamily: 'var(--font-geist-sans), sans-serif',
              },
              components: {
                Card: {
                  boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                  paddingLG: 24,
                },
                Button: {
                  controlHeight: 40,
                  fontWeight: 600,
                },
              }
            }}
          >
            <App style={{ minHeight: '100vh', background: '#f9fafb' }}>
              {children}
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
