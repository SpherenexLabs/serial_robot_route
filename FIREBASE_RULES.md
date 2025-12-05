# Firebase Security Rules Configuration

## IMPORTANT: Update These Rules in Firebase Console

Your Firebase project currently has restricted access. To allow the app to work, you need to update the security rules in the Firebase Console.

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **procart-8d2f6**

---

## Step 2: Update Realtime Database Rules

1. Go to **Realtime Database** > **Rules** tab
2. Replace the existing rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **Publish**

⚠️ **Note**: These rules allow public access for development. Before production, implement proper authentication.

---

## Step 3: Update Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

⚠️ **Note**: These rules allow public access for development.

---

## Step 4: Verify Rules Are Active

After publishing both rules:
1. Wait 1-2 minutes for rules to propagate
2. Refresh your application
3. Try uploading a file

---

## Production Security Rules (Use Later)

### Realtime Database (Production):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "media": {
      ".indexOn": ["uploadDate", "type"]
    },
    "playlists": {
      ".indexOn": ["isActive"]
    },
    "devices": {
      ".indexOn": ["status"]
    }
  }
}
```

### Storage (Production):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }
  }
}
```

---

## Troubleshooting

### Still getting permission denied?
1. Clear browser cache and cookies
2. Check Firebase Console > Project Settings > Service accounts
3. Verify the project ID matches in your config
4. Check the Firebase Console > Usage tab for any quota issues

### Can't publish rules?
1. Make sure you're logged in as the project owner
2. Check if the Firebase project is on the free plan (Spark)
3. Upgrade to Blaze plan if needed (pay-as-you-go)

---

## Current Status

✅ Firebase Config: Correct
✅ Firebase SDK: Installed
❌ Database Rules: Need to be updated
❌ Storage Rules: Need to be updated

**Action Required**: Update rules in Firebase Console now.
