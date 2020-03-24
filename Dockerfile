FROM node:12.14
WORKDIR /app
RUN mkdir /app/logs
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run start:ts
