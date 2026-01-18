import { migrateUserPasswords } from './supabaseClient';

// One-time password migration component
// This should be run once to hash existing passwords
const MigratePasswords = () => {
  const handleMigration = async () => {
    if (!window.confirm("This will hash all existing passwords. Users with plain text passwords will need to re-register. Continue?")) {
      return;
    }

    try {
      const result = await migrateUserPasswords();
      if (result.success) {
        alert("Password migration completed: " + result.message);
      } else {
        alert("Migration failed: " + result.error);
      }
    } catch (error) {
      alert("Migration error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', margin: '20px' }}>
      <h3>🔒 Password Security Migration</h3>
      <p>Click the button below to hash existing passwords in the database.</p>
      <p><strong>Warning:</strong> This is a one-time operation. Existing users may need to re-register.</p>
      <button 
        onClick={handleMigration}
        style={{
          background: '#e17055',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Migrate Passwords
      </button>
    </div>
  );
};

export default MigratePasswords;