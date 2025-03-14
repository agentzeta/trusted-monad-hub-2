
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import LoadingIndicator from './query/LoadingIndicator';
import ConsensusResponse from './query/ConsensusResponse';
import IndividualResponses from './query/IndividualResponses';
import ConsensusVisual from './ConsensusVisual';
import ConsensusStatistics from './ConsensusStatistics';
import ConsensusExplanation from './ConsensusExplanation';
import FollowUpQuestion from './query/FollowUpQuestion';
import ModelAccuracyLeaderboard from './leaderboard/ModelAccuracyLeaderboard';
import { useQueryContext } from '../hooks/useQueryContext';

interface QueryResponsesProps {
  isLoading: boolean;
  consensusResponse: string | null;
  responses: Response[];
}

const QueryResponses: React.FC<QueryResponsesProps> = ({
  isLoading,
  consensusResponse,
  responses
}) => {
  // Get access to the submitQuery function and query
  const { submitQuery, query } = useQueryContext();

  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  
  // Check if the query is related to FTSO or stock prediction
  const isFtsoRelated = query?.toLowerCase().includes('ftso') || 
                        query?.toLowerCase().includes('stock prediction') ||
                        query?.toLowerCase().includes('price prediction');
  
  // Add detailed logging for debugging
  useEffect(() => {
    console.log('QueryResponses component rendering with:', {
      isLoading,
      hasConsensus: !!consensusResponse,
      responseCount: responses.length,
      responseSources: responses.map(r => r.source),
      responseDetails: responses.map(r => ({
        id: r.id,
        source: r.source,
        contentLength: r.content.length,
        contentPreview: r.content.substring(0, 50) + '...',
        verified: r.verified
      })),
      isFtsoRelated
    });
  }, [isLoading, consensusResponse, responses, query, isFtsoRelated]);

  // Handle follow-up question submission
  const handleFollowUpSubmit = (question: string) => {
    submitQuery(question);
  };

  // If there are no responses and we're not loading, show a message
  if (responses.length === 0 && !isLoading && !consensusResponse) {
    return (
      <div className="mt-8 p-6 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-center text-slate-500">
          No responses from any AI models. Please check your API keys in settings.
        </p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingIndicator />}
      </AnimatePresence>
      
      {consensusResponse && !isLoading && (
        <ConsensusResponse 
          consensusResponse={consensusResponse} 
          timestamp={timestamp} 
        />
      )}
      
      {responses.length > 1 && !isLoading && consensusResponse && (
        <div className="mt-8">
          <ModelAccuracyLeaderboard 
            responses={responses} 
            consensusText={consensusResponse} 
          />
        </div>
      )}
      
      {responses.length > 1 && !isLoading && (
        <div className="mt-8">
          <ConsensusExplanation responses={responses} />
        </div>
      )}
      
      {responses.length > 1 && !isLoading && (
        <div className="mt-8">
          <ConsensusVisual responses={responses} />
        </div>
      )}
      
      {responses.length > 1 && !isLoading && isFtsoRelated && (
        <div className="mt-8 p-6 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-md border border-blue-200 dark:border-blue-800/30 shadow-sm">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>FTSO Enhanced Response:</strong> This prediction leverages Flare Time Series Oracle technology 
            to provide more accurate predictions based on decentralized consensus mechanisms.
          </p>
        </div>
      )}
      
      {responses.length > 1 && !isLoading && (
        <div className="mt-8">
          <ConsensusStatistics responses={responses} />
        </div>
      )}
      
      {responses.length > 0 && !isLoading && (
        <div className="mt-10">
          <IndividualResponses responses={responses} />
        </div>
      )}
      
      {responses.length > 0 && !isLoading && (
        <div className="mt-8">
          <FollowUpQuestion onSubmit={handleFollowUpSubmit} isLoading={isLoading} />
        </div>
      )}
    </>
  );
};

export default QueryResponses;
