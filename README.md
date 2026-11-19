# Ethiopian Youth AI Empowerment Initiative — Landing Page

Based on the Netlify landing design, with:

1. Hero image set to Pexels  
   `https://images.pexels.com/photos/5940715/pexels-photo-5940715.jpeg`
2. Hidden admin dashboard at `/admin.html` (not linked in public navigation)

## Public site
Open `index.html` (or deploy the folder to Netlify).

## Admin dashboard (hidden)
Open directly:

- Local: `http://localhost:5500/admin.html` (or your static server)
- Deployed: `https://your-site.netlify.app/admin.html`

There is **no public nav link** to admin.

Default admin key (backend `.env`):

```env
ADMIN_KEY=eyai-admin-2026
```

API endpoints used by admin:

- `POST /api/admin/login`
- `GET /api/admin/registrations` with header `x-admin-key`
