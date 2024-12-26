import React, { useState } from 'react';

interface GoogleSheetsEmbedProps {
  spreadsheetId: string;
}

export function GoogleSheetsEmbed({ spreadsheetId, sheetId }: GoogleSheetsEmbedProps) {
  // Use the direct spreadsheet ID format instead of the /e/ format
  const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pubhtml?widget=true&headers=false&chrome=false`;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-[600px] bg-white/5 rounded-lg overflow-hidden border border-purple-900/30 relative" style={{ isolation: 'isolate' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <div className="text-red-500 text-center p-4">
            <p className="font-medium mb-2">Failed to load Google Sheet</p>
            <p className="text-sm">Please verify:</p>
            <ul className="text-sm list-disc list-inside mt-2">
              <li>The spreadsheet is published to the web</li>
              <li>The sharing settings allow anyone with the link to view</li>
              <li>You're using the correct spreadsheet ID</li>
            </ul>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <iframe
        key={iframeKey}
        src={url}
        className="w-full h-full"
        style={{ border: 0, backgroundColor: 'transparent', minHeight: '600px' }}
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads"
        title="Google Sheets"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError('Failed to load spreadsheet');
        }}
      />
    </div>
  );
}