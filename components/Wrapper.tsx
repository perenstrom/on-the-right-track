import { cn } from 'helpers/tailwindUtils';

export const Wrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mx-auto my-0 max-w-[800px] px-4 py-0 pt-8 md:pt-24',
      className
    )}
    {...props}
  />
);
