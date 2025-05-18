# Centered-Daylight-Clock-PWA
A set of files to run as a static webpage and as a Progressive Web Application (PWA) that displays the localized solar time and some weather trends. 

FYI, this idea was created by me but all the code and setup was AI generated. 


## Project Files

1. **`index.html`** - The main HTML structure of the application
   - Contains the layout and elements of the clock interface
   - Links to the CSS and JavaScript files
   - Includes PWA meta tags and service worker registration

2. **`styles.css`** - All styling for the application
   - Contains responsive layouts for different screen sizes
   - Includes dark/light mode support
   - Defines all colors, sizes, and visual properties

3. **`app.js`** - The main application logic
   - Handles solar calculations
   - Manages the clock display and canvas drawing
   - Implements weather data fetching and storage
   - Contains all interactive functionality

4. **`manifest.json`** - PWA configuration
   - Defines how the app appears when installed
   - Specifies icons, colors, and display mode

5. **`service-worker.js`** - Offline functionality
   - Caches assets for offline use
   - Manages background syncing and notifications
   - Handles updates to the application

6. **`icons/`** directory - Contains all app icons in various sizes
   - Required for PWA installation
   - See the icon requirements in the template
