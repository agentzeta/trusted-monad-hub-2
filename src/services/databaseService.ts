
import { supabase } from '@/integrations/supabase/client';

export const saveResponseToDatabase = async (
  userId: string,
  queryText: string,
  consensusResponse: string,
  responses: any[],
  blockchainReference?: string,
  attestationId?: string,
  teeVerificationId?: string
) => {
  try {
    console.log(`Saving response to database for user ${userId}`);
    
    const { data, error } = await supabase
      .from('consensus_responses')
      .insert([
        {
          user_id: userId,
          query: queryText,
          consensus_response: consensusResponse,
          source_responses: responses,
          blockchain_reference: blockchainReference || null,
          attestation_id: attestationId || null,
          tee_verification_id: teeVerificationId || null,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error saving response to database:', error);
      throw new Error('Failed to save response to database');
    }

    console.log('Response saved to database:', data);
    return data;
  } catch (error) {
    console.error('Database save operation failed:', error);
    throw new Error('Database save operation failed');
  }
};
