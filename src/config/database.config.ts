import mysql from 'mysql2/promise';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';

export const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const sessionStore = new (MySQLStore(session))({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 900_000, // clean up every 15 minutes
    expiration: 86_400_000,           // sessions expire after 24 hours
    createDatabaseTable: true,        // auto-creates the sessions table
});
