const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create messages directory if it doesn't exist
const messagesDir = path.join(__dirname, 'messages');
if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir);
}

// Initialize messages.json if it doesn't exist
const messagesFile = path.join(messagesDir, 'messages.json');
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, '[]', 'utf8');
}

// Handle contact form submissions
app.post('/submit-contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Read existing messages
        const messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));

        // Create new message object
        const newMessage = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            name,
            email,
            message
        };

        // Add new message
        messages.push(newMessage);

        // Save back to file with pretty formatting
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save message'
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Messages will be saved in: ${messagesFile}`);
});
