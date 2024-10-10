import * as fs from 'fs-extra';

const srcDir: string = 'src/nodemailer-correo';
const destDir: string = 'dist/nodemailer-correo';

// Function to copy the directory
function copyAssets(): void {
  try {
    fs.copySync(srcDir, destDir, { overwrite: true });
    console.log('Static assets copied successfully for development!');
  } catch (err) {
    console.error('Error copying static assets:', err);
  }
}

// Run the function
copyAssets();
