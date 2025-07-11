#!/bin/bash

echo "🚀 Blueprint Material Analyzer - Complete Setup"
echo "=============================================="
echo ""

# Check if gh is authenticated
if gh auth status >/dev/null 2>&1; then
    echo "✅ GitHub CLI is authenticated"
    
    # Create the repository
    echo "🔄 Creating GitHub repository..."
    gh repo create blueprint-material-analyzer \
        --public \
        --source=. \
        --remote=origin \
        --description "Web app that analyzes construction blueprints to calculate material quantities and costs" \
        --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Repository created and code pushed!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. ✅ GitHub Repository: $(gh repo view --web --no-browser | grep -o 'https://github.com/[^"]*')"
        echo "2. ✅ Live App: https://blueprint-material-analyzer-aq6u18649-danger-dangers-projects.vercel.app"
        echo ""
        echo "🔗 Connect Vercel to GitHub:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Find your 'blueprint-material-analyzer' project"
        echo "3. Go to Settings → Git"
        echo "4. Connect to the GitHub repository you just created"
        echo "5. Future pushes to 'main' will auto-deploy!"
        echo ""
        echo "🧪 Test Your App:"
        echo "- Upload a construction blueprint PDF"
        echo "- Select materials (2x4s, 2x6s, plywood, etc.)"
        echo "- Get instant cost estimates!"
        echo "- Download results as CSV"
    else
        echo "❌ Failed to create repository. Please check authentication."
    fi
else
    echo "🔐 GitHub authentication required..."
    echo ""
    echo "Please run ONE of these commands:"
    echo ""
    echo "Option 1 - Web browser authentication:"
    echo "  gh auth login"
    echo ""
    echo "Option 2 - Device flow (if browser doesn't work):"
    echo "  gh auth login --web"
    echo ""
    echo "Then run this script again: ./complete-setup.sh"
    echo ""
    echo "📱 Your app is already live at:"
    echo "https://blueprint-material-analyzer-aq6u18649-danger-dangers-projects.vercel.app"
fi