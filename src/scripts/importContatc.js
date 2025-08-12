import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import Contact from '../db/models/Contact.js';

dotenv.config();

const __dirname = path.resolve();
// const filePath = path.join(__dirname, 'contacts.json');
// if (!process.env.MONGODB_URL) {
//   console.error('MONGODB_URL is not defined in the environment variables');
//   process.exit(1);
// }
// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1);
//   });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', async () => {
//   const contacts = await contact.find().exec();
//   const contactsJson = JSON.stringify(contacts, null, 2);
//   await fs.writeFile(filePath, contactsJson);
//   console.log(`Contacts exported to ${filePath}`);
//   process.exit(0);
// });
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
// });

const importContacts = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error(
        'MONGODB_URL is not defined in the environment variables'
      );
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, 'contacts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const contacts = JSON.parse(data);
    if (!Array.isArray(contacts) || contacts.length === 0) {
      throw new Error('No contacts found in the JSON file');
    }
    console.log(`Importing ${contacts.length} contacts...`);

    await Contact.insertMany(contacts);

    console.log('Contacts imported successfully!');

    process.exit();
  } catch (error) {
    console.error('Import failed:', error.message);

    process.exit(1);
  }
};

importContacts();
