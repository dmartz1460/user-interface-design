# Usage

This document details how to run this project locally on your system so you can test and interact with the interface of the Smart Bank. These details include the required tools needed to run the interface and how to use the interface when once it's up and running.

## Dependencies

Follow these steps to setup your local system:

1. Install [node.js](https://nodejs.org/en) and [VSCode](https://code.visualstudio.com/download)
2. Migrate to your desired development directory or existing GitHub repo.
3. Initialize Vite using NPM 
    - `npm init vite`
4. Follow the resulting prompts
    - Select `yes` to install `create-vite@5.5.2`
    - Choose a project name, this will create a folder to act as the root of the project
    - Select the `Svelte` framework and `Javascript` variant
5. Install the recommended VS Code extensions
    - Svelte for VS Code
    - npm Intellisense
    - HTML CSS Support

## Running

Once your dependencies are installed, you can begin testing the interface. Run the following commands:

```bash
# Navigate to your project root
cd <project-name>

# Install npm dependencies from package.json
npm install

# Run the project in your local environment
npm run dev
```

Paste the resulting localhost address into your browser or `Ctrl + Click` on the link in your terminal to migrate to it automatically. 

## Testing

Now that you have launched the web server, you can begin interacting with interface.