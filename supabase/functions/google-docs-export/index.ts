
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    // Get the request body
    const { query, consensusResponse } = await req.json();
    
    if (!query || !consensusResponse) {
      return new Response(
        JSON.stringify({ error: 'Query and consensus response are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get authorization token from request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Extract JWT token from Bearer token
    const token = authHeader.replace('Bearer ', '');
    
    // Log for debugging
    console.log(`Exporting to Google Docs: ${query.substring(0, 50)}...`);
    console.log(`Content length: ${consensusResponse.length} characters`);
    
    // Format the document title
    const documentTitle = `AI Consensus: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`;
    
    // Mock successful response for demo purposes
    // In a real implementation, you would use the token to call the Google Docs API
    console.log(`Creating Google Doc with title: ${documentTitle}`);
    
    // Mock document URL - in a real implementation, this would be returned from the Google Docs API
    const documentUrl = `https://docs.google.com/document/d/mock-document-id/edit`;
    
    return new Response(
      JSON.stringify({ 
        documentUrl,
        message: 'Document created successfully',
        title: documentTitle,
        exportedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to export to Google Docs' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
