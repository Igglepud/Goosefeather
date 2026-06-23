// Simple test to see if we can show the modal at all
console.log("Test modal script loaded");

// Add a simple button to test directly
const testButton = document.createElement('button');
testButton.textContent = "TEST OPEN MODAL";
testButton.onclick = function() {
    console.log("TEST: Button clicked");
    const modalElement = document.getElementById('modal');
    if (modalElement) {
        console.log("TEST: Found modal element");
        modalElement.classList.remove('modal-hidden');
        console.log("TEST: Removed modal-hidden class");
    } else {
        console.log("TEST: Modal element not found!");
    }
};

document.body.appendChild(testButton);