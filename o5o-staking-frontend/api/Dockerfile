FROM node:16
WORKDIR /docapp
COPY package*.json /docapp/
RUN npm install
COPY . /docapp
EXPOSE 3000
CMD ["npm", "start"]