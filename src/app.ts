import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { simulateBattle } from './battle';
import { calculateLevel, randomInt, formatAdena, renderPage, renderSimplePage } from './utils';
import { WEAPONS, ARMORS } from './gamedata';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/style', express.static(path.join(__dirname, '../style'))); // Serve the original CSS and Images

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
}));

// --- MySQL DATABASE CONNECTION ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- MIDDLEWARE: THE CHEATING MECHANISM ---
const antiCheatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const safePaths = ['/death', '/restart', '/highscores', '/highscores/submit', '/style/style.css'];

    if (req.session.dead && !safePaths.includes(req.path)) {
        return res.redirect('/death');
    }
    if (req.session.caught && req.path !== '/battle/ambush') {
        req.session.dead = true;
        req.session.caught = false;
        return res.redirect('/death?reason=coward');
    }

    // Additional sanity checks for routes that require an initialized character
    const safePathsInit = ['/', '/orc', '/death', '/restart', '/highscores', '/highscores/submit', '/style/style.css'];
    if (!req.session.race && !safePathsInit.includes(req.path)) {
        return res.redirect('/');
    }

    next();
};

app.use(antiCheatMiddleware);

// --- ROUTES ---

// 1. Initialize character & Home Town
app.get('/', (req, res) => {
    // If they haven't chosen a race yet, show the Start Game screen
    if (!req.session.race) {
        return res.send(renderSimplePage('Game Start | <a href="/highscores">See Highscores</a>', `
            Hello!<br><br>
            What do you want to be?<br><table><tr><td></td></tr></table>
            <form method="POST" action="/">
                <select class="box" name="select_race">
                    <option value="1">Human</option>
                    <option value="2">Orc</option>
                </select>
                <input type="submit" class="box" value="Submit">
            </form>
        `));
    }

    // Determine age and definition logic...
    const age = randomInt(10, 70);
    let definition = "boy";
    if (age > 18 && age <= 50) definition = "man";
    else if (age > 50) definition = "old timer";

    let helloMsg = "Welcome to City of Aden.<br><br>";
    if (req.session.firstTime && !req.session.welcomed) {
        helloMsg = `You have selected to be Human. Congratulations!<br>Welcome to City of Aden. You are an average ${definition}, aged ${age}, and you came here with ${formatAdena(req.session.adena!)} adena.<br><br>`;
        req.session.welcomed = true;
    }

    const html = renderPage("Home Town", req.session, `
        ${helloMsg}
        <form method="POST" action="/travel">
            <select name="destination" class="box">
                <option value="/shop/armors">Go to Armor Shop</option>
                <option value="/shop/weapons">Go to Weapon Shop</option>
                <option value="/inn">Go to Inn</option>
                <option value="/battle">Fight on the Battlefield</option>
                <option value="/suicide">Commit Suicide</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `);
    res.send(html);
});

// Process Race Selection
app.post('/', (req, res) => {
    if (!req.session.race) {
        if (req.body.select_race === '2') {
            return res.redirect('/orc');
        }

        req.session.race = 'Human';
        req.session.health = 100;
        req.session.adena = 300;
        req.session.experience = 0;
        req.session.weaponId = 0;
        req.session.armorId = 0;
        req.session.firstTime = true;
    }
    res.redirect('/');
});

// Orc disabled module route
app.get('/orc', (req, res) => {
    res.send(renderSimplePage('Hmmm', `
        Module not yet finished :(<br><br>
        <a href="/">Go back</a>
    `));
});

// Helper route to handle the dropdown navigation
app.post('/travel', (req, res) => {
    const dest = req.body.destination || '/';
    res.redirect(dest);
});

// 2. Battle logic
app.get('/battle', (req, res) => {
    const s = req.session;
    const oldLevel = calculateLevel(s.experience!);
    const results = simulateBattle(s.weaponId!, s.armorId!, s.experience!);

    s.health! -= results.hpLost;
    s.experience! += results.expGained;
    s.adena! += results.adenaGained;

    if (s.health! <= 0) {
        s.dead = true;
        return res.redirect('/death');
    }

    const newLevel = calculateLevel(s.experience!);
    let leveledUp = newLevel > oldLevel;
    if (leveledUp) s.health = 100;

    const luck = randomInt(1, 15);
    let isAmbushed = luck === 5;
    if (isAmbushed) s.caught = true;

    let html = `
        You are on the battleground.<br>
        Using your ${WEAPONS[s.weaponId!]?.name || "Fists"} you have killed ${results.orcsKilled} ${results.orcsKilled === 1 ? 'Orc' : 'Orcs'}.<br>
        Your Health ${leveledUp ? 'was rejuvenated' : 'dropped'} to ${s.health!} ${leveledUp ? 'plus' : 'but'} you gained ${results.expGained} Experience and ${formatAdena(results.adenaGained)} adena.<br><br>
    `;

    if (leveledUp) html += `<b>Congratulations! You have reached level ${newLevel}.</b><br><br>`;

    if (isAmbushed) {
        const surprises = [
            "Out of the blue 3 Orcs surrounded you and you can't escape.",
            "You forgot to check your back and you get stormed by 6 Orcs.",
            "You find yourself in a delicate position, the Orc Leader has come with reinforcements.",
            "As you were walking along 4 Orcs jumped out of the bushes.",
            "You reached a dead-end and you find yourself cornered by 3 Orcs."
        ];
        html += `<font color="red">${surprises[randomInt(0, surprises.length - 1)]}</font><br><br>`;
        html += `<form method="POST" action="/battle/ambush"><button class="box" type="submit">Fight them!</button></form>`;
    } else {
        const moves = ["Look behind the tree", "Walk Further", "Check the cave", "Jump in the bushes", "Look Behind", "Run up the hill", "Go and look behind the big rock", "Enter the Abandoned House", "Enter the Abandoned Town", "Scream 'I WANT MORE ORCS'", "Check out the Orc Ruins", "Open the locked tower"];
        const move = moves[randomInt(0, moves.length - 1)];
        html += `<a href="/">Go back in town</a> | <a href="/battle">${move}</a>`;
    }

    res.send(renderPage("Battleground", s, html));
});

// 2.5. Shops, Inn, Suicide
app.get('/shop/weapons', (req, res) => {
    let alertHtml = "";
    if (req.session.weapon_buy) {
        alertHtml = `<font color='green'>You have bought a weapon. [${WEAPONS[req.session.weaponId!]?.name}]</font><br><br>`;
        req.session.weapon_buy = false; // Reset flash
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Weapons Shop.<br>
        The nice man greets you and lets you look thru his swords.<br>
        You see these weapons available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Attack</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Elven Sword</td><td>16</td><td>${formatAdena(300)}</td></tr>
            <tr class='con2'><td>Stormbringer</td><td>18</td><td>${formatAdena(5000)}</td></tr>
            <tr class='con1'><td>Sword Of Valhalla</td><td>32</td><td>${formatAdena(18000)}</td></tr>
            <tr class='con2'><td>Elemental Sword</td><td>45</td><td>${formatAdena(160000)}</td></tr>
            <tr class='con1'><td>The Forgotten Blade</td><td>85</td><td>${formatAdena(3000000)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/shop/weapons">
            <select class="box" name="select_weapon">
                <option value="1">Get out of Weapons Shop</option>
                <option value="2">Buy Elven Sword</option>
                <option value="3">Buy Stormbringer</option>
                <option value="4">Buy Sword Of Valhalla</option>
                <option value="5">Buy Elemental Sword</option>
                <option value="6">Buy The Forgotten Blade</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Weapons Shop", req.session, mainContent));
});

app.post('/shop/weapons', (req, res) => {
    const val = parseInt(req.body.select_weapon);
    if (val === 1 || isNaN(val)) return res.redirect('/');

    const weaponId = val - 1; // Options map to weaponId 1-5
    const cost = WEAPONS[weaponId]?.cost;

    if (cost === undefined || req.session.adena! < cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/shop/weapons">Go back</a>`));
    }

    req.session.adena! -= cost;
    req.session.weaponId = weaponId;
    req.session.weapon_buy = true;
    res.redirect('/shop/weapons');
});

app.get('/shop/armors', (req, res) => {
    let alertHtml = "";
    if (req.session.armor_buy) {
        alertHtml = `<font color='green'>You have bought an Armor. [${ARMORS[req.session.armorId!]?.name}]</font><br><br>`;
        req.session.armor_buy = false; // Reset flash
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Armor Shop.<br>
        The old man greets you and lets you look thru his Armors.<br>
        You see these Armors available:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Defense</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Leather Armor</td><td>10</td><td>${formatAdena(500)}</td></tr>
            <tr class='con2'><td>Wooden Armor</td><td>15</td><td>${formatAdena(8000)}</td></tr>
            <tr class='con1'><td>Plate Armor</td><td>29</td><td>${formatAdena(30000)}</td></tr>
            <tr class='con2'><td>Steel Armor</td><td>38</td><td>${formatAdena(120000)}</td></tr>
            <tr class='con1'><td>Mithril Alloy Armor</td><td>59</td><td>${formatAdena(1500000)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/shop/armors">
            <select class="box" name="select_armor">
                <option value="1">Get out of Armor Shop</option>
                <option value="2">Buy Leather Armor</option>
                <option value="3">Buy Wooden Armor</option>
                <option value="4">Buy Plate Armor</option>
                <option value="5">Buy Steel Armor</option>
                <option value="6">Buy Mithril Alloy Armor</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Armor Shop", req.session, mainContent));
});

app.post('/shop/armors', (req, res) => {
    const val = parseInt(req.body.select_armor);
    if (val === 1 || isNaN(val)) return res.redirect('/');

    const armorId = val - 1; // Options map to armorId 1-5
    const cost = ARMORS[armorId]?.cost;

    if (cost === undefined || req.session.adena! < cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/shop/armors">Go back</a>`));
    }

    req.session.adena! -= cost;
    req.session.armorId = armorId;
    req.session.armor_buy = true;
    res.redirect('/shop/armors');
});

app.get('/inn', (req, res) => {
    let alertHtml = "";
    if (req.session.inn_buy) {
        alertHtml = `<font color='green'>You have bought food. Your HP has risen to [${req.session.health!}]</font><br><br>`;
        req.session.inn_buy = false; // Reset flash
    }

    let mainContent = `
        ${alertHtml}
        You have arrived at Inn.<br>
        The old lady greets you and sets you at a table.<br>
        You see a menu and you open it. Inside you read:<br><br>

        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='50%'>Name</td><td width='30%'>HP Restoration</td><td width='20%'>Adena</td></tr>
            <tr class='con1'><td>Juice</td><td>4</td><td>${formatAdena(8)}</td></tr>
            <tr class='con2'><td>Apple</td><td>6</td><td>${formatAdena(11)}</td></tr>
            <tr class='con1'><td>Hotdog</td><td>15</td><td>${formatAdena(30)}</td></tr>
            <tr class='con2'><td>Mash Potatos</td><td>25</td><td>${formatAdena(80)}</td></tr>
            <tr class='con1'><td>Turkey</td><td>50</td><td>${formatAdena(180)}</td></tr>
        </table>
        <br>
        <form method="POST" action="/inn">
            <select class="box" name="item">
                <option value="1">Get out of Inn</option>
                <option value="2">Buy Juice (4 health restoration)</option>
                <option value="3">Buy Apple (6 health restoration)</option>
                <option value="4">Buy Hotdog (15 health restoration)</option>
                <option value="5">Buy Mash Potatos (25 health restoration)</option>
                <option value="6">Buy Turkey (50 health restoration)</option>
            </select>
            <input type="submit" class="box" value="Submit">
        </form>
    `;

    res.send(renderPage("Inn", req.session, mainContent));
});

app.post('/inn', (req, res) => {
    const val = parseInt(req.body.item);
    if (val === 1 || isNaN(val)) return res.redirect('/');

    // Config based on option value (2-6)
    const foodConfig: Record<number, { cost: number, hp: number }> = {
        2: { cost: 8, hp: 4 },
        3: { cost: 11, hp: 6 },
        4: { cost: 30, hp: 15 },
        5: { cost: 80, hp: 25 },
        6: { cost: 180, hp: 50 },
    };

    const food = foodConfig[val];
    if (!food || req.session.adena! < food.cost) {
        return res.send(renderPage("Error", req.session, `Sorry, you need more money.<br><br><a href="/inn">Go back</a>`));
    }

    req.session.adena! -= food.cost;
    req.session.health = Math.min(100, req.session.health! + food.hp);
    req.session.inn_buy = true;
    res.redirect('/inn');
});

app.get('/suicide', (req, res) => {
    let mainContent = `
        Are you sure you want to kill yourself?<br><br>
        <form method="POST" action="/suicide">
            <select class="box" name="c">
                <option value="1">Yes, stab yourself in the heart</option>
                <option value="2">No, my bad</option>
            </select>
            <input type="submit" class="box" style="width:70px" value="Submit">
        </form>
    `;
    res.send(renderPage("Commit Suicide", req.session, mainContent));
});

app.post('/suicide', (req, res) => {
    if (req.body.c === '1') {
        req.session.dead = true;
        res.redirect('/death');
    } else {
        res.redirect('/');
    }
});

// 3. Fighting the Ambush
app.post('/battle/ambush', (req, res) => {
    if (req.session.caught) req.session.caught = false;
    res.redirect('/battle');
});

// 4. Death Route
app.get('/death', (req, res) => {
    const reason = req.query.reason === 'coward'
        ? "You were caught trying to flee an ambush! Game Over !!"
        : "Your health dropped to 0 and you died.";

    res.send(renderSimplePage("Ups...", `
        <font color='red'>${reason}</font><br><br>
        <a href="/highscores/submit">Write your status in Highscores!</a><br>
        <a href="/restart">Play Again?</a>
    `));
});

// 5. Highscore Submit Form
app.get('/highscores/submit', (req, res) => {
    if (!req.session.dead) return res.redirect('/');

    res.send(renderSimplePage('Highscores', `
        <form method="POST" action="/highscores">
            Name: <input type="text" class="box" name="name" placeholder="Anonymous">
            <input type="submit" class="box" value="Submit">
        </form>
    `));
});

// 6. Process Highscore and View Board
app.post('/highscores', async (req, res) => {
    if (req.session.dead && !req.session.wrote_highscore) {
        const name = req.body.name || 'Anonymous';
        const s = req.session;
        const level = calculateLevel(s.experience!);

        await pool.execute(
            'INSERT INTO highscores (total_exp, name, race, adena, level, created) VALUES (?, ?, ?, ?, ?, NOW())',
            [s.experience, name, s.race, s.adena, level]
        );
        req.session.wrote_highscore = true;
    }
    res.redirect('/highscores');
});

// 7. View Highscores
app.get('/highscores', async (req, res) => {
    let rowsHtml = '';
    try {
        const [rows] = await pool.execute('SELECT * FROM highscores ORDER BY total_exp DESC, adena DESC LIMIT 25');
        const highscores = rows as any[];

        highscores.forEach((score, idx) => {
            const rowClass = idx % 2 === 0 ? 'con1' : 'con2';

            const d = new Date(score.created);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedDate = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;

            rowsHtml += `
                <tr class='${rowClass}'>
                    <td>${score.name || 'Anonymous'}</td>
                    <td>${score.level}</td>
                    <td>${score.total_exp}</td>
                    <td>${formatAdena(score.adena)}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;
        });

        if (highscores.length === 0) {
            rowsHtml = "<tr class='con1'><td colspan='5'>No highscores...</td></tr>";
        }
    } catch (err) {
        console.error(err);
        rowsHtml = "<tr class='con1'><td colspan='5'>Error loading highscores...</td></tr>";
    }

    res.send(renderSimplePage('Top 25 Players', `
        <table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'>
                <td width='30%'>Name</td>
                <td width='10%'>Level</td>
                <td width='20%'>Total exp</td>
                <td width='20%'>Adena</td>
                <td width='20%'>Date</td>
            </tr>
            ${rowsHtml}
        </table>
        <br><br><a href="/">Go back</a>
    `));
});

// 8. Experience Table Route
app.get('/exp-table', (req, res) => {
    if (!req.session.race) return res.redirect('/');

    const currentExp = req.session.experience || 0;
    const currentLevel = calculateLevel(currentExp);

    const getLayoutForLevels = (start: number, end: number) => {
        let html = `<table class='main' width='100%' cellspacing='1' cellpadding='4'>
            <tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>`;
        for (let i = start; i <= end; i++) {
            const expReq = i === 1 ? 0 : Math.round(i * (176 + (i * 162)));
            const rowClass = currentLevel === i ? 'con4' : (i % 2 === 0 ? 'con1' : 'con2');
            html += `<tr class='${rowClass}'><td align='center'>${i}</td><td>${expReq}</td></tr>`;
        }
        html += `</table>`;
        return html;
    };

    let mainContent = `
        <table width='100%' cellspacing='0' cellpadding='0'>
        <tr class='empty' valign='top'>
        <td width='24%'>
            ${getLayoutForLevels(1, 20)}
        </td>
        <td width='1%'></td>
        <td width='24%'>
            ${getLayoutForLevels(21, 40)}
        </td>
        <td width='1%'></td>
        <td width='24%'>
            ${getLayoutForLevels(41, 60)}
        </td>
        <td width='1%'></td>
        <td width='25%'>
            ${getLayoutForLevels(61, 80)}
        </td></tr></table>
        <br><br><a href="/">Go back</a>
    `;

    res.send(renderSimplePage(`Experience Table [Current XP: ${currentExp}]`, mainContent));
});

// 9. Restart Route
app.get('/restart', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Mini-Lineage modern rewrite running on port 3000!'));
