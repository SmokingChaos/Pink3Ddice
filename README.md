# Neon Dice 2000

A web-based 3D dice rolling application with neon-themed visuals and realistic physics.

## Project Structure

This project has been reorganized with a modular structure to improve maintainability and allow for easier future enhancements:

```
neon-dice-2000/
├── index.html              # Main entry point
├── assets/                 # Static assets
│   └── css/                # Stylesheets
│       └── style.css       # Main stylesheet
├── src/                    # Source code
│   ├── main.js             # Application entry point
│   ├── config.js           # Configuration parameters
│   ├── utils/              # Utility functions
│   │   ├── loader.js       # Resource loader
│   │   └── debug.js        # Debug utilities
│   ├── graphics/           # Graphics-related code
│   │   ├── textures.js     # Texture generation
│   │   └── floor.js        # Floor creation
│   └── physics/            # Physics-related code
│       ├── world.js        # Physics world setup
│       └── dice.js         # Dice physics implementation
└── libs/                   # Local fallback libraries (optional)
    ├── three.module.js     # Three.js local copy
    └── rapier.es.js        # Rapier physics local copy
```

## Key Features

- **Modular Design**: Each component is separated into its own module with clear responsibilities.
- **Configuration-Driven**: Most parameters are centralized in the config.js file for easy adjustments.
- **Progressive Loading**: Improved loading experience with progress tracking and helpful error messages.
- **Optimized Resources**: Balanced resource usage for better performance.
- **Simplified Implementation**: Focused on core functionality for reliability.

## Getting Started

1. Clone or download this repository
2. Host it using a local web server (e.g., using `npx http-server`)
3. Open the index.html file in your browser

## Extending the Application

This modular structure makes it easy to extend the application with new features:

### Adding Visual Effects

To add new visual effects, you can:

1. Create new texture generation functions in `src/graphics/textures.js`
2. Add new settings to the `config.js` file
3. Implement the effects in the appropriate module

### Enhancing Dice Behavior

To enhance dice behavior:

1. Modify the physics parameters in `config.js`
2. Extend the dice controller in `src/physics/dice.js`
3. Add new event handling in `src/main.js`

### Adding UI Elements

To add new UI elements:

1. Add HTML markup to `index.html`
2. Add styles to `assets/css/style.css`
3. Add interaction code in `src/main.js`

## Troubleshooting

- **Loading Issues**: Check browser console for errors. The application attempts to use CDN libraries first, then fallback to local copies.
- **Performance Problems**: Adjust texture sizes in `config.js` and reduce complexity.
- **Mobile Compatibility**: The application is responsive but may need further optimization for low-end devices.

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

This project is available for open use.