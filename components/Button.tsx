import { cn } from 'helpers/tailwindUtils';

export const Button = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'min-w-40 rounded-sm border border-[#999999] bg-[hsl(0,0%,85%)] px-4 py-[0.2rem] hover:bg-[hsl(0,0%,75%)]',
      className
    )}
    {...props}
  />
);
