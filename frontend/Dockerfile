FROM node:18

# Set working directory to match the docker-compose volume path
WORKDIR /var/www/html/aivideo/frontend

# Automatically create a Next.js app if package.json is missing
RUN test -f package.json || npx create-next-app@latest . --ts --app --eslint --tailwind --no-install

# Ensure 'app' directory exists, and create a basic 'page.tsx' file
RUN mkdir -p app && \
    echo "export default function Home() { return <h1>Hello, World!</h1> }" > app/page.tsx


# Install dependencies only if package.json exists
RUN if [ -f package.json ]; then npm install; fi

# Install next globally
RUN npm install -g next

# Expose the default port used by Next.js (3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
