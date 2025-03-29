const fs = require('fs');

// Read the content of sample.txt
fs.readFile('sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);
});

// Create or overwrite a file called newfile.txt
fs.writeFile('newfile.txt', 'This is a new file created by Node.js!', (err) => {
    if (err) {
        console.error('Error creating file:', err);
        return;
    }
    console.log('newfile.txt has been created successfully.');
});

// Append content to sample.txt
fs.appendFile('sample.txt', '\nAppended content.', (err) => {
    if (err) {
        console.error('Error appending to file:', err);
        return;
    }
    console.log('Content appended to sample.txt successfully.');
});

// Delete the newfile.txt
fs.unlink('newfile.txt', (err) => {
    if (err) {
        console.error('Error deleting file:', err);
        return;
    }
    console.log('newfile.txt has been deleted successfully.');
});