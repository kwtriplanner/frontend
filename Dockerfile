# 1단계: build stage
FROM node:18 as build
WORKDIR /app

# 의존성만 복사해서 캐시 유지를 유도
COPY package*.json ./
RUN npm install

# 전체 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: production stage
FROM node:18-slim
WORKDIR /app

# serve 설치 (더 작은 이미지에서 설치)
RUN npm install -g serve

# 빌드된 결과물만 복사
COPY --from=build /app/build ./build

# serve로 정적 파일 서빙
CMD ["serve", "-s", "build", "-l", "3000"]
