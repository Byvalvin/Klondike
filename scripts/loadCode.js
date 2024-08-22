// Function to load scripts from the stack dynamically
const loadScripts = (stack) => {
  if (stack.length === 0) {
    console.log('All scripts loaded.');
    return;
  }

  const { src, msg } = stack.shift(); // Get the next script from the stack

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onload = () => {
    console.log(msg);
    loadScripts(stack); // Load the next script from the stack
  };
  script.onerror = () => console.error(`Failed to load ${src}`);
  document.body.appendChild(script);
};


// Define the stack of scripts
const scriptStack = [
  { src: 'scripts/mode.js', msg: 'Done loading mode.js' },
  { src: 'scripts/difficulty.js', msg: 'Done loading difficulty.js' },
    // Add more scripts here as needed
];
// Start loading scripts from the stack
loadScripts(scriptStack);
