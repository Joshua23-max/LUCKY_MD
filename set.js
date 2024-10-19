const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkpkbkV3Mmh5TmF2SW9aUnkrS3ZDNmNvcDIxemhzVjVOVE1WOC9SL0lYaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUEFxMjZ6V3pENGpyYTFVVWhRa3lYeVUrRHA3Q0xYYjJ2OWtZVkFqczluWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhSElGc2o0b2pWY3lHYmpkSFAwK0V3eHhaQjQ4MzBxcDJZQldSNDdSV1dRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzeGx0ODZNWWw3cGwyQlNPNWo1TWRPamh6cG1MR3lCUkt5L3hraThnRzNVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtOM1dYeXA2cE9HS3JSSGxXLzZuM2ozYW16cXRIU1hBSjB0MU1maWNnMmc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktJdk1vM2FGMmt3eThVKzlsKzhxY1JzVGtwdkNybmlzQjJzeU1UeGx5QXM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUxQUUhVL2lhVHN5NUJaM1k0NkhENzltb1BKOEpBK2NrbU5UR29JMVNWND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN3RKRyt4ZXZxZVJxNzhDY1loTDJDTE42NUJQb3JXb3grQVMwQ1JJSXJsVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJkRFRZSExLa3I3dFBVaFlGWGZjYXFKSnRNMFZkRXVDdnMrSnNZL016TXZyRTZub3I4RlZ3MkR1SW9DKzRkL0JlRXQzZjBuQzEwVk5LL2tjNkFIamdnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTcxLCJhZHZTZWNyZXRLZXkiOiJyUnMxQkRsZnNyamN3NlQ2ZDJ3RXczbFUxc09tbUJKUmw0NDROKzRjVFBBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6NjEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo2MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ4SExvNzFCUVF2dTJ2clQ3dS1lTWV3IiwicGhvbmVJZCI6ImEwNTA5MWUxLTg5NmQtNDYwMi04OWJhLWNjYjY1YTFlN2M5ZCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJsam5DditWd041cm53YS9BRWFhQm5tci9HSVU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia1RWbndVckEvMENkZDRpM1Vhbkh4Z09ncnVrPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ikg1S0tCUlpNIiwibWUiOnsiaWQiOiIyNzg0MDQ1NDY3Nzo1MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJKb3NodWEgU29yYSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTWJyb3RnREVKdnN6N2dHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVEZJTVZJVU1kZ1RxNG1sdkJiOGZvRm9mMnZtUUx3cHl4ano3ZnRSSW95bz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiS2pVcFF3by8rZFplTy84dHg1azY4VUtuVzRQakJrZVlTR0pFNDRmTmtIcmVJdHVLOFY2WGNpTG8yN29QTEJpbmVXUjFVQ2MwR1FEMkwxbTZyNVVURGc9PSIsImRldmljZVNpZ25hdHVyZSI6ImptMGNPZEk2VTBqU0xGVS95UUNPeEcwRmxmMDkrV0p3U2s0Mnh3OXp1SGpPK0lGUTl0dFBNa0lqOVlwb3ExUkpKR2pGdmdOWTZwdCsrc1hJRmFwM2pBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc4NDA0NTQ2Nzc6NTJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVXhTREZTRkRIWUU2dUpwYndXL0g2QmFIOXI1a0M4S2NzWTgrMzdVU0tNcSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyOTM2MTQ0OSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFEUnMifQ==',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Fredi Ezra",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "27840454677",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://i.imgur.com/ecRS5BQ.jpeg,https://files.catbox.moe/g73xvl.jpeg,https://files.catbox.moe/qh500b.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Dodoma',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
