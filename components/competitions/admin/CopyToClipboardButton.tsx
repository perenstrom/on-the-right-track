import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

export const CopyToClipboardButton = ({
  text,
  disabled = false,
  className
}: {
  text: string;
  disabled?: boolean;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleCopy}
      disabled={disabled || !text}
    >
      {copied ? (
        <>
          <Check className="size-3 text-green-600" /> Kopierad!
        </>
      ) : (
        <>
          <Copy className="size-3" /> Kopiera
        </>
      )}
    </Button>
  );
};
