# 3D Neon Dice Game

A web-based 3D dice rolling application with neon-themed visuals and realistic physics.

## Overview

This application provides an interactive 3D environment where users can roll virtual dice with neon visual effects. The dice feature realistic physics behavior, including bouncing, collisions, and proper rotational dynamics.

## Features

- **Realistic 3D Physics**: Utilizes the Rapier physics engine for accurate simulation of dice movement and collisions
- **Neon Visual Theme**: Custom-designed dice with glowing neon edges and pips
- **Interactive Controls**: Simple click interaction to roll the dice
- **Responsive Design**: Adapts to different screen sizes and resolutions
- **Shadow Effects**: Enhanced visual realism with proper lighting and shadows
- **Performance Optimized**: Built with efficiency in mind for smooth animations

## Technical Details

### Libraries Used

- **Three.js (v0.160.0+)**: 3D rendering engine for visualizing the dice and environment
- **Rapier3D (v0.11.2+)**: Physics simulation library for realistic dice movement

### Implementation Highlights

- Custom dice face textures generated dynamically with canvas
- Proper collision boundaries using physics walls
- Optimized physics parameters for realistic dice movement
- Error handling for smooth user experience

## Getting Started

### Prerequisites

- A modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled

### Installation

1. Clone or download this repository
2. No build steps required - this is a standalone HTML application

### Running the Application

1. Open the `index.html` file in your web browser
2. Click anywhere on the screen to roll the dice
3. Wait for the dice to settle to see the result

## Usage Tips

- The dice will roll with random impulses each time for varied results
- The walls are slightly transparent to maintain focus on the dice
- The physics simulation ensures fair and random outcomes

## Customization Options

If you wish to modify the application, here are some key areas you might want to adjust:

- **Dice Colors**: Change the neon colors by modifying the hexadecimal color values in the `createDice()` function
- **Dice Size**: Adjust the size variable in the `createDice()` function
- **Physics Parameters**: Fine-tune the restitution, friction, and damping values for different dice behavior

## Troubleshooting

If you encounter issues:

1. Ensure your browser is up to date
2. Check that JavaScript is enabled
3. Verify that WebGL is supported and enabled in your browser
4. Check the browser console for any error messages

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

This project is available for open use.

## Acknowledgments

- Three.js for the 3D rendering capabilities
- Dimforge's Rapier for the physics simulation
