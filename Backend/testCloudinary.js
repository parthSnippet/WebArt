import { v2 as cloudinary } from 'cloudinary';

// Test combination: old cloud name + new key/secret
cloudinary.config({
  cloud_name: 'dbfohmgdy',
  api_key: '812357117968394',
  api_secret: '7fYydCtO2FTIC2_defhZKjRIJ2A'
});

console.log('Testing cloud_name: dbfohmgdy + new key/secret...');

cloudinary.api.ping()
  .then(r => {
    console.log('✅ Ping OK:', JSON.stringify(r));
    // Now test actual upload
    const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const stream = cloudinary.uploader.upload_stream({ folder: 'test' }, (err, res) => {
      if (err) console.log('❌ Upload fail:', err.message);
      else console.log('✅ Upload OK:', res.secure_url);
    });
    stream.end(buf);
  })
  .catch(e => console.log('❌ Ping fail:', e.message));
