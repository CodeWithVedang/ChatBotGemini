// api/views.js
import fs from 'fs';
import path from 'path';

const viewsFilePath = path.join(process.cwd(), 'views.json');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(viewsFilePath, 'utf8');
            const views = JSON.parse(data).views;
            res.status(200).json({ views });
        } catch (error) {
            res.status(500).json({ error: 'Failed to read views data' });
        }
    } else if (req.method === 'POST') {
        try {
            let views = 0;
            if (fs.existsSync(viewsFilePath)) {
                const data = fs.readFileSync(viewsFilePath, 'utf8');
                views = JSON.parse(data).views;
            }
            views += 1;
            fs.writeFileSync(viewsFilePath, JSON.stringify({ views }));
            res.status(200).json({ views });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update views data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}