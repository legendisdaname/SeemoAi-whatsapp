#!/bin/bash

# WhatsApp Dashboard Frontend Setup Script
echo "🚀 Setting up WhatsApp Dashboard Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file from template..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local file with your configuration"
else
    echo "✅ .env.local file already exists"
fi

# Check if backend is running
echo "🔍 Checking backend connection..."
if curl -s https://platform.seemoai.com/api/health > /dev/null; then
  echo "✅ Backend is running at https://platform.seemoai.com"
else
    echo "⚠️  Backend is not running. Please start the backend first:"
    echo "   cd ../SeemoAi-whatsappBack && npm run dev"
fi

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local file with your API configuration"
echo "2. Make sure backend is running on port 3001"
echo "3. Run 'npm run dev' to start development server"
echo ""
echo "🌐 Dashboard will be available at: https://platform.seemoai.com"
echo "🔗 API Documentation: https://platform.seemoai.com/api-docs" 