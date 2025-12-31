// Script to reset admin password in the database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'citylife.db');
const db = new Database(dbPath);

// Check if bcrypt is available
let bcrypt;
try {
  bcrypt = require('bcrypt');
  console.log('✅ bcrypt is available');
} catch (error) {
  console.error('❌ bcrypt is not installed. Run: npm install bcrypt');
  process.exit(1);
}

async function resetPassword() {
  const newPassword = 'CityLyfe2025!'; // Temporary password

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    const result = db.prepare('UPDATE users SET password = ? WHERE email = ?')
      .run(hashedPassword, 'citylife32@outlook.com');

    if (result.changes > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('');
      console.log('Login credentials:');
      console.log('  Email: citylife32@outlook.com');
      console.log('  Password: CityLyfe2025!');
      console.log('');
      console.log('⚠️  Please change this password after logging in via the Profile page');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    db.close();
  }
}

resetPassword();
