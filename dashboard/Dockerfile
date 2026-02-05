# المرحلة الأولى: بناء المشروع (Build Stage)
FROM node:20-slim AS build-stage

WORKDIR /app

# تعميم متغير الرابط ليكون متاحاً أثناء الـ Build
ARG VITE_API_URL=https://athar-api.alihadi.click/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000 \
    && npm install

COPY . .

# تنفيذ عملية الـ Build مع المتغيرات الجديدة
RUN npx vite build

# المرحلة الثانية: تقديم الملفات عبر Nginx
FROM nginx:stable-alpine

# تغيير بورت Nginx من 80 إلى 3001
RUN sed -i 's/listen\(.*\)80;/listen 3001;/g' /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

# فتح بورت 3001
EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]