import express from 'express';
import cors from 'cors';
import { supabase } from './lib/supabase.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/applications', async (req, res) => {
  const { category, permit, uploadedDocs } = req.body;

  const { data: app, error: appError } = await supabase
    .from('applications')
    .insert([{ category, permit }])
    .select()
    .single();

  if (appError) return res.status(500).json({ error: appError.message });

  const docsToInsert = Object.entries(uploadedDocs).map(([name, file]) => ({
    application_id: app.id,
    name,
    filename: file.name,
    mimetype: file.type,
    size: file.size,
  }));

  const { error: docsError } = await supabase.from('documents').insert(docsToInsert);
  if (docsError) return res.status(500).json({ error: docsError.message });

  res.status(201).json({ application: app });
});

app.listen(4000, () => {
  console.log('✅ UbakaFix API running on http://localhost:4000');
});
