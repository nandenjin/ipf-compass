ARG SRC_URL_EVENTS_2023
ARG SRC_URL_VENUES
ARG SRC_URL_LOCATIONS

ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_STGORAGE_BUCKET
ARG FIREBASE_MESSAGE_SENDER_ID
ARG FIREBASE_APP_ID

FROM node:20-alpine as builder
WORKDIR /app
ADD $SRC_URL_EVENTS_2023 data/2023.csv
ADD $SRC_URL_VENUES data/venue.csv
ADD $SRC_URL_LOCATIONS data/location.csv
COPY package.json package-lock.json ./
RUN npm ci
COPY scripts scripts
RUN npm run import
COPY . .

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_STGORAGE_BUCKET=$FIREBASE_STGORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID=$FIREBASE_MESSAGE_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID

RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
