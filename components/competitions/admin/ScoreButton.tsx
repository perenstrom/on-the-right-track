import { cn } from 'helpers/tailwindUtils';

interface ScoreButtonProps {
  readonly $variant: 'wrong' | 'correct';
}

const buttonColors: Record<
  ScoreButtonProps['$variant'],
  { background: string; border: string; hover: string; text: string }
> = {
  wrong: {
    background: 'bg-[hsl(18,95%,40%)]',
    border: 'border-[hsl(18,95%,15%)]',
    hover: 'hover:bg-[hsl(18,95%,35%)]',
    text: 'text-[hsl(0,0%,100%)]'
  },
  correct: {
    background: 'bg-[hsl(116,46%,55%)]',
    border: 'border-[hsl(116,46%,30%)]',
    hover: 'hover:bg-[hsl(116,46%,50%)]',
    text: 'text-[hsl(0,0%,15%)]'
  }
};

export const ScoreButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & ScoreButtonProps) => (
  <button
    className={cn(
      'flex-1 rounded-sm border border-solid px-4 py-0',
      buttonColors[props.$variant].background,
      buttonColors[props.$variant].border,
      buttonColors[props.$variant].hover,
      buttonColors[props.$variant].text,
      className
    )}
    {...props}
  />
);
