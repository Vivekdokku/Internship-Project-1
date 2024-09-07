document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    document.getElementById('responseMessage').innerText = result.message;

    // Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
});

// Show all messages when "Show Messages" button is clicked
document.getElementById('showMessages').addEventListener('click', async function() {
    const response = await fetch('http://localhost:3000/retrieve-all');
    const messages = await response.json();

    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // Clear previous messages

    messages.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.classList.add('message-card');

        messageCard.innerHTML = `
            <p><strong>Name:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Message:</strong> ${message.message}</p>
        `;

        messageContainer.appendChild(messageCard);
    });
});

// Search for a message by name
document.getElementById('searchBtn').addEventListener('click', async function() {
    const searchName = document.getElementById('searchName').value;

    const response = await fetch(`http://localhost:3000/retrieve/${searchName}`);
    const message = await response.json();

    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // Clear previous messages

    if (message.name) {
        const messageCard = document.createElement('div');
        messageCard.classList.add('message-card');

        messageCard.innerHTML = `
            <p><strong>Name:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Message:</strong> ${message.message}</p>
        `;

        messageContainer.appendChild(messageCard);
    } else {
        messageContainer.innerHTML = `<p>No messages found for the name "${searchName}".</p>`;
    }
});
