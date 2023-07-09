FROM node:14.8.0-alpine3.12 AS deps

WORKDIR /srv
COPY package*.json ./
RUN npm ci --only=production


FROM alpine:3.12 AS release

ENV V 14.8.0
ENV FILE node-v$V-linux-x64-musl.tar.xz

# The below RUN commands does the following
# download libstdc++ required by nodeJS
# download curl and mark is as virtual to be deleted later along with all its deps
# fetch NodeJS runtime tarball
# tarextract NodeJS runtime to /usr/local
# removes npm related dependencies
# delete curl
RUN apk add --no-cache libstdc++ \
  && apk add --no-cache --virtual .deps curl \
  && curl -fsSLO --compressed \
  "https://unofficial-builds.nodejs.org/download/release/v$V/$FILE" \
  && tar -xJf $FILE -C /usr/local --strip-components=1 \
  && rm -f $FILE /usr/local/bin/npm /usr/local/bin/npx \
  && rm -rf /usr/local/bin/node_modules \
  && apk del .deps

WORKDIR /srv
COPY --from=deps /srv/node_modules ./node_modules
COPY . .

# EXPOSE directive is a way of documenting that the image plans on listening using a specific port
# Does not actually open the port to the outside world; that is done later at container run time
EXPOSE 1337
ENV HOST 0.0.0.0
ENV PORT 1337

CMD ["node", "producer-http-basic.js"]
