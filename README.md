# XSS Security Lab

A modern full-stack web application built with React, Express, TypeScript, and various security-focused features.

## 🚀 Features

- **Frontend**: React with TypeScript, Vite, and Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **UI Components**: Radix UI and Shadcn UI
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query
- **Styling**: Tailwind CSS with custom animations
- **Containerization**: Docker support
- **Development**: Hot reloading and TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional)
- pnpm or npm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/XssSecurityLab.git
cd XssSecurityLab
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.docker.example .env
```
Edit the `.env` file with your configuration.

4. Start the development server:
```bash
pnpm dev
```

## 🐳 Docker Setup

1. Build the Docker image:
```bash
docker-compose build
```

2. Start the containers:
```bash
docker-compose up
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - TypeScript type checking
- `pnpm db:push` - Push database schema changes

## 🏗️ Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared types and utilities
├── public/          # Static assets
├── dist/            # Build output
└── docker/          # Docker configuration
```

## 🔒 Security Features

- XSS protection
- CSRF protection
- Secure session management
- Input validation with Zod
- Secure password handling

## 📚 Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Radix UI
  - React Query
  - React Hook Form

- **Backend**:
  - Express.js
  - TypeScript
  - Drizzle ORM
  - Passport.js
  - WebSocket support

- **Database**:
  - PostgreSQL
  - Drizzle ORM

- **DevOps**:
  - Docker
  - Docker Compose
  - TypeScript
  - ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Query](https://tanstack.com/query/latest) 