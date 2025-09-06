# Weather Forecast App

Hostaway coding assignment

## Architecture Overview

### Tech Stack
- **React Native** with **TypeScript** 
- **Redux Toolkit** 
- **React Navigation** 
- **OpenWeatherMap API**
- **Expo** 

## How It Works

The application follows a clean, organized structure that separates concerns and makes the codebase maintainable. The main `app` folder contains all the application logic, organized into logical sections that work together seamlessly.

The `components` directory houses all reusable UI components like WeatherSearch, WeatherResult, and Forecast. Each component is self-contained with its own styling and logic, making them easy to test and maintain. The WeatherSearch component handles user input and city suggestions, while WeatherResult displays the current weather information with beautiful animations and responsive design.

The `screens` folder contains the main application screens, with HomeScreen serving as the central hub that orchestrates all the components and manages the overall user experience. This screen connects the search functionality with the weather display, ensuring a smooth flow from user input to data presentation.

State management is handled through Redux Toolkit in the `store` directory, where the weather slice manages all weather-related data, caching, and API interactions. This centralized approach ensures data consistency across the entire application and provides efficient caching mechanisms that reduce API calls and improve performance.

The `services` layer handles all external API communications, providing a clean abstraction between the UI components and the OpenWeatherMap API. This separation makes it easy to modify API endpoints or add new data sources without affecting the rest of the application.

Utility functions are organized in the `utils` folder, containing shared constants, helper functions, and reusable logic like temperature formatting and geolocation services. The `navigation` structure is simple and focused, using React Navigation to create a seamless single-screen experience that feels native and responsive.

The entire architecture is built with TypeScript, providing type safety throughout the codebase and catching potential errors during development.

## Things I would've changed if I had more time

I would've added more solid animations and more reusable components such as a Typography, TextInput, Cards. Maybe even refactored some of the bigger files.
Also, would have definitely hidden my API-key for OpenWeatherMap in an .env file or integrated it as a secret through Github or other pipelines.

## Getting Started

1. **Install dependencies**
   ```bash
   yarn 
   ```

2. **Set up environment variables**
   - Add your OpenWeatherMap API key to the environment or use my free tier that I have included. The key should be added in `app/config/api`

3. **Run the app with Expo**
   ```bash
   yarn start
   ```
   
   This will start the Expo development server. You can then:
   - Scan the QR code with the Expo Go app on your phone
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator

## Testing

The app includes the following tests:
- **Component tests** 
- **Utility tests**
- **Integration tests** 

Run tests with:
```bash
yarn test
```

