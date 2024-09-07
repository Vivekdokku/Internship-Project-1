const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

// Create Contact Model
const Contact = mongoose.model('Contact', contactSchema);

// API Route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ message: 'Thank you for your message!' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving the data!' });
    }
});

// API Route to retrieve all messages
app.get('/retrieve-all', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving messages!' });
    }
});

// API Route to retrieve contact by name
app.get('/retrieve/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const contact = await Contact.findOne({ name: name });
        if (!contact) {
            return res.status(404).json({ message: 'No contact found with this name!' });
        }
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving the data!' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
