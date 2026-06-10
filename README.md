# Mario's Piece of Cake

A gothic-elegant bakery ordering app. Online ordering, kitchen display system, and Django admin for menu management.

---

## Stack

- **Frontend** — React (CRA), TailwindCSS, PayPal SDK — deployed on Vercel
- **Backend** — Django + Django REST Framework — deployed on Railway
- **Kitchen Display** — React + Vite — run locally or hosted separately
- **Media** — Cloudinary (production) / local filesystem (development)
- **Database** — PostgreSQL (production via Railway) / SQLite (local dev)

---

## Local Development

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
SECRET_KEY=any-local-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Admin: http://localhost:8000/admin

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_PAYPAL_CLIENT_ID=your_sandbox_paypal_client_id
```

```bash
npm start
```

### Kitchen Display

```bash
cd kitchen-display
npm install
npm run dev
```

---

## Production Environment Variables

### Railway (Backend)

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Set to `False` |
| `DATABASE_URL` | Automatically set by Railway Postgres |
| `ALLOWED_HOSTS` | `your-app.railway.app` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://your-app.railway.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Vercel (Frontend)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | `https://your-app.railway.app` |
| `REACT_APP_PAYPAL_CLIENT_ID` | PayPal live client ID |

---

## Deployment

### Backend (Railway)
Push to `main` — Railway auto-deploys via `railway.json`. Runs `migrate` on release and starts gunicorn.

### Frontend (Vercel)
Push to `main` — Vercel auto-deploys. SPA rewrite rule is in `vercel.json`.

---

## Menu Management

Use the Django admin at `/admin/` to:
- Add/edit/delete menu categories
- Add/edit/delete menu items (upload photos via Cloudinary)
- View and manage orders
