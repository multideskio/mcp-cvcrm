export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🚀 CV CRM MCP Server</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Servidor MCP rodando. Conecte através do Cursor para usar os tools.
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px' }}>
        <h2>📋 Status</h2>
        <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
          <li>✅ Servidor Next.js ativo</li>
          <li>✅ TypeScript configurado</li>
          <li>⏳ Configure o MCP Server no Cursor</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px' }}>
        <h2>📚 Documentação</h2>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Consulte a pasta <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>docs/</code> para instruções completas.
        </p>
        <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
          <li><strong>Quick Start:</strong> docs/00-PROJECT-OVERVIEW.md</li>
          <li><strong>Arquitetura:</strong> docs/01-ARCHITECTURE.md</li>
          <li><strong>Autenticação:</strong> docs/02-AUTHENTICATION.md</li>
          <li><strong>Deploy:</strong> docs/05-DEPLOYMENT.md</li>
        </ul>
      </div>
    </main>
  );
}

