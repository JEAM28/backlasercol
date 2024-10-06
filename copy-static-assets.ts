import * as fs from 'fs-extra';

// Source directory
const srcDir: string = 'src/nodemailer-correo';

// Destination directory
const destDir: string = 'dist/nodemailer-correo';

// Copy directory
try {
  fs.copySync(srcDir, destDir, { overwrite: true });
  console.log('Static assets copied successfully!');
} catch (err) {
  console.error('Error copying static assets:', err);
}
