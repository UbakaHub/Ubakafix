import { supabase } from './supabaseClient';

export const uploadDocumentsToSupabase = async (
  applicationId: number,
  uploadedDocs: { [key: string]: File | null }
): Promise<void> => {
  for (const [docType, file] of Object.entries(uploadedDocs)) {
    if (!file) continue;

    const filePath = `${applicationId}/${docType}-${file.name}`;

    const { error } = await supabase.storage
      .from('application-files') // 🪣 your bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error(`❌ Upload failed for ${docType}:`, error.message);
    } else {
      console.log(`✅ Uploaded ${docType} to: ${filePath}`);
    }
  }
};
