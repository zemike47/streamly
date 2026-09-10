bash
#!/bin/bash

set -e

IMAGE_URI="$1"

if [ -z "$IMAGE_URI" ]; then
  echo "Usage: deploy.sh <image-uri>"
  exit 1
fi

AWS_REGION="eu-north-1"
AWS_ACCOUNT_ID="516737672784"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "Deploying: $IMAGE_URI"

echo "Loading production parameters from Parameter Store..."

DATABASE_URL=$(aws ssm get-parameter \
  --name "/streamly/prod/DATABASE_URL" \
  --with-decryption \
  --region "$AWS_REGION" \
  --query "Parameter.Value" \
  --output text)

JWT_SECRET=$(aws ssm get-parameter \
  --name "/streamly/prod/JWT_SECRET" \
  --with-decryption \
  --region "$AWS_REGION" \
  --query "Parameter.Value" \
  --output text)

REDIS_URL=$(aws ssm get-parameter \
  --name "/streamly/prod/REDIS_URL" \
  --with-decryption \
  --region "$AWS_REGION" \
  --query "Parameter.Value" \
  --output text)

umask 077

cat > /opt/streamly/.env <<EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
REDIS_URL=$REDIS_URL
AWS_REGION=$AWS_REGION
AWS_S3_BUCKET=streamly-videos-m-001
PORT=3000
EOF

echo "Logging in to Amazon ECR..."

aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "Pulling new image..."

docker pull "$IMAGE_URI"

echo "Stopping old container..."

docker stop streamly-backend || true

echo "Removing old container..."

docker rm streamly-backend || true

echo "Starting new container..."

docker run -d \
  --name streamly-backend \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /opt/streamly/.env \
  "$IMAGE_URI"

echo "Deployment completed."

docker ps --filter "name=streamly-backend"

