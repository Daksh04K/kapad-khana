# Environment Variables Setup

## Quick Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder values

## Required Variables

### PORT
```env
PORT=5000
```
The port your backend server will run on. Default is 5000.

### MONGODB_URI
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kapadkhana
```

**How to get:**
1. Create account at https://cloud.mongodb.com/
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `kapadkhana`

### JWT_SECRET
```env
JWT_SECRET=your_random_secret_key_here
```

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
This creates a secure random string.

### CLOUDINARY_CLOUD_NAME
### CLOUDINARY_API_KEY
### CLOUDINARY_API_SECRET
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop
```

**How to get:**
1. Create account at https://cloudinary.com/
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

### RAZORPAY_KEY_ID (Optional)
### RAZORPAY_KEY_SECRET (Optional)
```env
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=abcdefghijklmnop
```

**How to get:**
1. Create account at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test Keys for development
4. Copy Key ID and Key Secret

**Note:** If you don't set these, online payment will not work, but COD (Cash on Delivery) will still work.

## Example .env File

```env
PORT=5000
MONGODB_URI=mongodb+srv://john:mypass123@cluster0.mongodb.net/kapadkhana
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Security Notes

- ⚠️ Never commit `.env` file to Git
- ⚠️ Use different credentials for development and production
- ⚠️ Keep your JWT_SECRET long and random
- ⚠️ Use Razorpay TEST keys for development
- ⚠️ Whitelist your IP in MongoDB Atlas Network Access
