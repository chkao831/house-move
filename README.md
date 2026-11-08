# House Move Tracker

A furniture tracking dashboard for managing house move purchases. Built with Next.js, MongoDB Atlas, and Tailwind CSS.

## Features

- **CRUD Operations**: Add, edit, and delete furniture items
- **Smart Filtering**: Filter by category, status, and priority
- **Sortable Columns**: Click any column header to sort
- **Statistics Dashboard**: 
  - Total spent on confirmed purchases
  - Items by status breakdown
  - Spending by category
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Item Fields

| Field | Required | Description |
|-------|----------|-------------|
| Store/Vendor | Yes | e.g., B&Q, Daals, Furnicomp |
| Item Name | Yes | Product name/description |
| Price (£) | Yes | Cost in GBP |
| Category | Yes | Living Room, Kitchen, Bedroom, etc. |
| Priority | Yes | 1-5 star rating |
| Status | Yes | Wishlist, Pending, Ordered, Shipped, Delivered, etc. |
| Order Date | No | When the item was ordered |
| Delivery Date | No | Expected/actual delivery date |
| Link | No | Product URL |
| Notes | No | Additional notes |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your MongoDB credentials:
   ```
   MONGODB_URI=mongodb+srv://your_user:your_password@your-cluster.mongodb.net/
   MONGODB_DB=house_move
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Render

### Quick Deploy

1. Push this repo to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Render will auto-detect the `render.yaml` blueprint

### Environment Variables

Set these in Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `MONGODB_DB` | `house_move` |

### Build Settings (Auto-detected from render.yaml)

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20

## Project Structure

```
house_move/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── furniture/route.ts  # CRUD API
│   │   │   └── stats/route.ts      # Statistics API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main dashboard
│   ├── components/
│   │   ├── FilterBar.tsx
│   │   ├── FurnitureModal.tsx
│   │   ├── FurnitureTable.tsx
│   │   └── StatsCards.tsx
│   ├── lib/
│   │   └── mongo.ts                # Database connection
│   └── types/
│       └── furniture.ts            # TypeScript types
├── render.yaml                     # Render deployment blueprint
├── .env.example
└── package.json
```

## License

Private project for house move management.
