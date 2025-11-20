/**
 * Create Admin Script
 * Run this to create the first admin user
 */

import dotenv from 'dotenv';
import { DatabaseService } from '../src/services/database.service';
import { AdminService } from '../src/services/admin.service';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('🔐 Création d\'un administrateur\n');

    // Initialize database
    const dbType = (process.env.DB_TYPE || 'filedb') as 'filedb' | 'mongodb';
    const dbPath = process.env.FILE_DB_PATH || './data';
    await DatabaseService.initialize(dbType, { path: dbPath });
    console.log('✅ Base de données connectée\n');

    // Get admin details
    const name = await question('Nom de l\'administrateur: ');
    const email = await question('Email: ');
    const password = await question('Mot de passe: ');
    const role = await question('Rôle (admin/super_admin) [admin]: ') || 'admin';

    console.log('\n🔄 Création de l\'administrateur...');

    const admin = await AdminService.createAdmin({
      name,
      email,
      password,
      role: role as 'admin' | 'super_admin',
    });

    console.log('\n✅ Administrateur créé avec succès!');
    console.log(`\nDétails:`);
    console.log(`  - Nom: ${admin.name}`);
    console.log(`  - Email: ${admin.email}`);
    console.log(`  - Rôle: ${admin.role}`);
    console.log(`\nVous pouvez maintenant vous connecter à /admin/login\n`);

    await DatabaseService.close();
    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();

