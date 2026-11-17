// =============================================================
// reset-db.js — Recria o banco E popula do zero
// =============================================================
// COMO USAR:  npm run db:reset
//
// O QUE ESTE ARQUIVO FAZ:
//   Atalho que roda `db:setup` + `db:seed` em sequência.
//   Útil quando você mexeu no schema ou no seed e quer
//   garantir que o banco está limpo e populado.
//
// CONCEITO APRENDIDO:
//   - Como orquestrar scripts npm a partir de outro script
//   - Como usar child_process.execSync para executar comandos shell
// =============================================================

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('🔄 Resetando banco de dados...\n');

try {
  console.log('─'.repeat(50));
  console.log('▶  Passo 1/2: criando schema');
  console.log('─'.repeat(50));
  execSync('npm run db:setup', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n' + '─'.repeat(50));
  console.log('▶  Passo 2/2: populando dados');
  console.log('─'.repeat(50));
  execSync('npm run db:seed', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n🎉 Banco resetado com sucesso!');
} catch (err) {
  console.error('\n❌ Erro durante o reset.');
  process.exit(1);
}