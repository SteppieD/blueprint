#!/bin/bash

echo "=== GitHub Repository Setup Script ==="
echo ""
echo "This script will help you:"
echo "1. Authenticate with GitHub"
echo "2. Create the repository"
echo "3. Push your code"
echo ""

# Check if already authenticated
if gh auth status >/dev/null 2>&1; then
    echo "✓ Already authenticated with GitHub"
else
    echo "Please authenticate with GitHub..."
    echo "You'll be prompted to:"
    echo "- Choose GitHub.com"
    echo "- Choose HTTPS protocol"
    echo "- Authenticate with a web browser"
    echo ""
    gh auth login
fi

# Create the repository
echo ""
echo "Creating GitHub repository..."
gh repo create blueprint-material-analyzer \
    --public \
    --source=. \
    --remote=origin \
    --description "Web app that analyzes construction blueprints to calculate material quantities and costs" \
    --push

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Repository created successfully!"
    echo ""
    echo "Your repository is now available at:"
    gh repo view --web --no-browser | grep -o 'https://github.com/[^"]*'
    echo ""
    echo "Next steps:"
    echo "1. Visit https://vercel.com"
    echo "2. Sign in with your GitHub account"
    echo "3. Click 'Import Project'"
    echo "4. Select 'blueprint-material-analyzer' repository"
    echo "5. Deploy with default settings"
else
    echo ""
    echo "❌ Failed to create repository"
    echo "Please check your authentication and try again"
fi