
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const AnthropicKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [anthropicKey, setAnthropicKey] = React.useState(apiKeys.anthropic || '');
  // For backward compatibility
  const [anthropicClaude35Key, setAnthropicClaude35Key] = React.useState(apiKeys.anthropicClaude35 || '');

  const handleSaveAnthropic = () => {
    if (anthropicKey) {
      // Save the same key for both standard and Claude 3.5 models
      setApiKey('anthropic', anthropicKey);
    }
  };

  // For backward compatibility
  const handleSaveAnthropicClaude35 = () => {
    if (anthropicClaude35Key) setApiKey('anthropicClaude35', anthropicClaude35Key);
  };

  return (
    <div className="space-y-4 mt-4">
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          One API key works for all Claude models (3 Haiku, 3.5 Sonnet, 3.7, etc)
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="anthropic-key">Anthropic API Key</Label>
        <Input
          id="anthropic-key"
          type="password"
          placeholder="sk-ant-..."
          value={anthropicKey}
          onChange={(e) => setAnthropicKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Provides access to all Claude models (Claude 3 Haiku, Claude 3.5 Sonnet, Claude 3.7, etc).
          One API key works for all Claude models.
        </p>
      </div>
      <Button onClick={handleSaveAnthropic} disabled={!anthropicKey} className="mb-4 w-full">Save Anthropic API Key</Button>
      
      {/* For backward compatibility - will be removed in future */}
      <div className="space-y-2 opacity-50 mt-8 pt-4 border-t border-gray-200">
        <Label htmlFor="anthropic-claude35-key" className="text-sm">Legacy: Separate Claude 3.5 API Key (Not needed)</Label>
        <Input
          id="anthropic-claude35-key"
          type="password"
          placeholder="sk-ant-..."
          value={anthropicClaude35Key}
          onChange={(e) => setAnthropicClaude35Key(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          This is only for backward compatibility. You shouldn't need separate keys for Claude models.
          Use the main Anthropic API key above instead.
        </p>
      </div>
      <Button onClick={handleSaveAnthropicClaude35} disabled={!anthropicClaude35Key} className="opacity-50">
        Save Separate Claude 3.5 Key (Not Recommended)
      </Button>
    </div>
  );
};

export default AnthropicKeyForm;
