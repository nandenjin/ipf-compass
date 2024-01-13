FROM node:20.11.0-alpine as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ARG SRC_URL_EVENTS_2023
ADD $SRC_URL_EVENTS_2023 data/2023.csv
ARG SRC_URL_VENUES
ADD $SRC_URL_VENUES data/venues.csv
ARG SRC_URL_LOCATIONS
ADD $SRC_URL_LOCATIONS data/locations.csv

COPY scripts scripts
RUN npm run import
COPY . .

ARG FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY

ARG FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN

ARG FIREBASE_STGORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_STGORAGE_BUCKET=$FIREBASE_STGORAGE_BUCKET

ARG FIREBASE_MESSAGE_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID=$FIREBASE_MESSAGE_SENDER_ID

ARG FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID

RUN npm run build

FROM node:20.11.0-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/data/db.sqlite3 ./data/db.sqlite3
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
