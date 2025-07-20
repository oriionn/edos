FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY drizzle drizzle
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
ENV SOCKET_PORT=8000
ENV WEB_PORT=8010
CMD ["bun", "src/index.ts"]

EXPOSE 8000
EXPOSE 8010
