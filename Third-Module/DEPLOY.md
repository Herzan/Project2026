# Deploy to Render (step by step)

You need free accounts on **GitHub**, **MongoDB Atlas** and **Render**.

## 1. Create the database (MongoDB Atlas)

1. Create a free **M0** cluster at https://cloud.mongodb.com.
2. **Database Access** -> Add Database User -> choose a username and password (letters and numbers only makes life easier) -> role "Read and write to any database".
3. **Network Access** -> Add IP Address -> **Allow access from anywhere** (`0.0.0.0/0`). Render does not have a fixed IP, so this is required.
4. **Database** -> Connect -> Drivers -> copy the connection string. It looks like:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `USER` and `PASSWORD`, and add the database name before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority`
   (If the password has symbols like `@` or `#`, URL-encode them or pick a simpler password.)

## 2. Put the project on GitHub

Inside the project folder (the one that contains `render.yaml`):

```bash
git init
git add .
git commit -m "Task manager"
git branch -M main
git remote add origin https://github.com/YOUR-USER/task-manager.git
git push -u origin main
```

The `.gitignore` already keeps `.env` and `node_modules` out of GitHub. Never upload your `.env`.

## 3. Deploy on Render

1. In Render click **New +** -> **Blueprint** -> connect your GitHub repo.
2. Render reads `render.yaml`. When it asks for **MONGO_URI**, paste your Atlas string from step 1.
3. Click **Apply / Deploy**. The first build takes a few minutes.
4. When the status says **Live**, open the `https://task-manager-xxxx.onrender.com` link and log in with `admin` / `admin123`.

### Doing it without the Blueprint (manual)
New + -> Web Service -> your repo, then:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Environment variables: `MONGO_URI` (Atlas string), `JWT_SECRET` (any long random text), `NODE_ENV=production`, `NODE_VERSION=20`.

## Good to know

- **Free plan sleeps** after a period without visitors, so the first page load can take up to about a minute.
- **Demo passwords are public** in this README. After deploying, log in and create your own account, or set `SEED_DEMO_DATA` to `false` in Render's Environment tab before the first start if you don't want demo users.
- **Build fails?** Open the service's **Logs** tab. **Server crashes with "MongoDB connection error"?** Re-check the Atlas password, the database name in the string, and that Network Access allows `0.0.0.0/0`.
- To update the site later: `git add . && git commit -m "update" && git push`. Render redeploys automatically.
