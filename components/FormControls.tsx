import { cn } from 'helpers/tailwindUtils';

export const SubmitButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)] hover:bg-[hsl(116,46%,50%)]',
      className
    )}
    {...props}
  />
);

export const CancelButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'border border-[hsl(12,100%,40%)] bg-[hsl(12,100%,50%)] hover:bg-[hsl(12,100%,55%)]',
      className
    )}
    {...props}
  />
);
