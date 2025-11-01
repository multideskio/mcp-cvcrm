import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CV CRM MCP Server',
  description: 'MCP Server para integração com API do CV CRM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

