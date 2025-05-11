# Solar Clock PWA - Deployment Guide

This guide will help you deploy your Solar Clock PWA so you can access it on your iPad or iOS device.

## Method 1: Local Network Deployment (Easiest)

If you only need to access the clock on your local network:

1. **Set up a simple local web server**:
   - Install Node.js from [nodejs.org](https://nodejs.org/)
   - Create a directory for your project and place all the files inside
   - Open a terminal/command prompt in that directory
   - Run `npx serve` (this will start a local web server)
   - Note the URL provided (typically http://localhost:3000)

2. **Access from your iOS device**:
   - Make sure your computer and iOS device are on the same WiFi network
   - Find your computer's local IP address (e.g., 192.168.1.10)
   - On your iOS device, open Safari and navigate to http://YOUR_IP_ADDRESS:3000
   - For example: http://192.168.1.10:3000

3. **Install as PWA**:
   - Once the page loads in Safari, tap the Share button
   - Select "Add to Home Screen"
   - Enter a name for the app (e.g., "Solar Clock")
   - Tap "Add"

## Method 2: Free Web Hosting (GitHub Pages)

For a more permanent solution that works anywhere:

1. **Create a GitHub account** if you don't have one

2. **Create a new repository**:
   - Go to github.com and log in
   - Click the "+" button and select "New repository"
   - Name it "solar-clock" or something similar
   - Make it public
   - Initialize with a README

3. **Upload your files**:
   - Click "Add file" > "Upload files"
   - Drag and drop all your project files (including the icons folder)
   - Commit the changes

4. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll down to "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click Save
   - Note the URL provided (e.g., https://yourusername.github.io/solar-clock)

5. **Install as PWA on your iOS device**:
   - Open the GitHub Pages URL in Safari
   - Follow the "Add to Home Screen" steps as above

## Method 3: Dedicated Web Hosting

If you want maximum reliability and control:

1. **Choose a web hosting provider** like:
   - [Netlify](https://www.netlify.com/) (has a generous free tier)
   - [Vercel](https://vercel.com/) (also has a free tier)
   - Any traditional web hosting service

2. **Upload your files** following the provider's instructions

3. **Configure your domain** if you have one

4. **Install as PWA** on your iOS device using the steps above

## Weather API Setup

To enable weather functionality:

1. **Get an API key**:
   - Go to [OpenWeatherMap](https://openweathermap.org/)
   - Create a free account
   - Generate an API key

2. **Update your app.js file**:
   - Find the CONFIG object at the top
   - Replace 'YOUR_API_KEY_HERE' with your actual API key
   - Re-upload the updated file

## Troubleshooting

If your PWA isn't working properly:

1. **Check browser console for errors**:
   - On iOS, enable Web Inspector in Safari's Advanced settings
   - Connect to a Mac and use Safari's developer tools to inspect

2. **Verify all files are present**:
   - Make sure all HTML, JS, and icon files are uploaded
   - Check that paths in the HTML and manifest files are correct

3. **Test PWA compatibility**:
   - Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) to audit your PWA
   - Fix any issues identified

4. **Clear cache and data**:
   - In Safari settings, clear website data if needed
   - Try reinstalling the PWA

## Keeping the Display Always On

For an iPad used as a dedicated display:

1. **Disable Auto-Lock**:
   - Go to Settings > Display & Brightness
   - Set Auto-Lock to "Never"

2. **Connect to power**:
   - Keep the iPad connected to power for continuous use

3. **Use Guided Access**:
   - Enable Guided Access in Settings > Accessibility
   - Triple-click the side button when the app is open
   - Configure options to prevent sleep and button presses

## Final Steps

1. **Position your iPad** in a convenient location

2. **Consider the orientation**:
   - The app works in both portrait and landscape

3. **Adjust brightness** to comfortable levels

Your Solar Clock PWA should now be working as a dedicated clock display showing centered daylight time!
