# Apparel ERP System

A comprehensive AI-powered apparel production and ERP workflow management system built with the MERN stack (MongoDB, Express/Next.js API, React, Node.js).

## Features

### Core Modules

1. **Style Assignment & Data Entry**
   - Buyer query management and merchant assignment
   - Complete style data capture (design number, buyer details, sample type)
   - Fabric details management (type, GSM, color, description)
   - Raw materials tracking (buttons per garment, etc.)

2. **Sampling & Deadline Management**
   - Pattern and sample development tracking
   - Deadline management between cutting and sampling departments
   - Priority-based planning for multiple buyers and merchants
   - Sample type categorization (proto, fit, production, other)

3. **Priority Planning Dashboard**
   - Dual-factor prioritization (sample deadline + delivery date)
   - Visual priority ranking system
   - Urgent delivery identification
   - Smart scheduling based on quantity and deadlines

4. **Production Planning with Reverse Planning**
   - Reverse planning from delivery dates
   - Stage-wise time allocation (cutting, production, finishing, packaging)
   - Delay detection and alerts
   - Progress tracking

5. **Communication & Collaboration**
   - Integrated comment system per style
   - Discussion threads for team collaboration
   - Real-time status updates
   - User assignment tracking

6. **Reporting Dashboard**
   - Style-wise statistics
   - Department-wise reports
   - Real-time status tracking
   - Priority and deadline visualization

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apparel-erp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/apparel-erp
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/apparel-erp
```

4. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
apparel-erp/
├── app/
│   ├── api/              # API routes
│   │   ├── styles/       # Style CRUD operations
│   │   ├── production/   # Production management
│   │   └── users/        # User management
│   ├── styles/           # Style detail pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Select.tsx
├── lib/
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Utility functions
├── models/               # MongoDB models
│   ├── Style.ts
│   ├── User.ts
│   └── Production.ts
└── package.json
```

## API Endpoints

### Styles
- `GET /api/styles` - Get all styles
- `POST /api/styles` - Create new style
- `GET /api/styles/[id]` - Get single style
- `PUT /api/styles/[id]` - Update style
- `DELETE /api/styles/[id]` - Delete style
- `POST /api/styles/[id]/comments` - Add comment to style

### Production
- `GET /api/production` - Get all production records
- `POST /api/production` - Create production record
- `GET /api/production/[id]` - Get single production record
- `PUT /api/production/[id]` - Update production record

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Usage Guide

### Creating a New Style

1. Click "New Style" button on the dashboard
2. Fill in the style details:
   - Design number
   - Buyer information (name, email)
   - Merchant assignment (name, email)
   - Sample type (proto, fit, production, other)
   - Fabric details (type, GSM, description, color)
   - Raw materials (buttons per garment, etc.)
   - Schedule (sample deadline, delivery date, quantity)
3. Click "Create Style"

### Managing Styles

- **Dashboard**: View statistics and recent styles
- **Styles Tab**: View all styles with status and priority
- **Sampling Tab**: Track sampling deadlines and progress
- **Production Tab**: View reverse-planned production schedules
- **Planning Tab**: Priority-ranked styles based on deadlines

### Adding Comments

1. Click on any style to view details
2. Scroll to the Comments section
3. Enter your name and comment
4. Click "Add Comment"

### Updating Status/Priority

1. Navigate to style detail page
2. Use the dropdown selectors to change status or priority
3. Changes are saved automatically

## Key Features Explained

### Reverse Planning
The system automatically calculates production schedules backward from delivery dates:
- Packaging: 3 days before delivery
- Finishing: 5 days before packaging
- Production: 25 days before finishing
- Cutting: 3 days before production

Delayed items are highlighted in red for immediate attention.

### Priority Planning
Styles are prioritized based on two factors:
1. Sample deadline urgency
2. Actual delivery date

This ensures that urgent deliveries with available fabric take precedence over rushed samples with distant deliveries.

### Communication
Each style has a dedicated comment section for team collaboration, reducing dependency on external communication tools.

## Future Enhancements

- AI-powered priority recommendations
- Integration with buyer platforms
- Email client integration
- Advanced reporting and analytics
- Mobile app development
- Real-time notifications

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## License

This project is proprietary and confidential.

## Support

For support and questions, please contact the development team.
