import { cn } from 'helpers/tailwindUtils';

interface PublishButtonProps {
  readonly variant: 'idle' | 'active';
}

const buttonColors: Record<
  PublishButtonProps['variant'],
  { background: string; border: string; hover: string; text: string }
> = {
  idle: {
    background: 'bg-[hsl(0,0%,85%)]',
    border: 'border-[hsl(0,0%,60%)]',
    hover: 'hover:bg-[hsl(0,0%,75%)]',
    text: 'text-[hsl(0,0%,15%)]'
  },
  active: {
    background: 'bg-[hsl(116,46%,55%)]',
    border: 'border-[hsl(116,46%,30%)]',
    hover: 'hover:bg-[hsl(116,46%,50%)]',
    text: 'text-[hsl(0,0%,15%)]'
  }
};

export const PublishButton = ({
  className,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & PublishButtonProps) => (
  <button
    className={cn(
      'w-full rounded-sm border border-solid px-4 py-0',
      buttonColors[variant].background,
      buttonColors[variant].border,
      buttonColors[variant].hover,
      buttonColors[variant].text,
      className
    )}
    {...props}
  />
);
