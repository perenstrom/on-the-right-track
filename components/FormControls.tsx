import { cn } from 'helpers/tailwindUtils';

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block font-medium', className)} {...props} />
);

export const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn('mb-1 w-full max-w-100', className)} {...props} />
);

export const TextArea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn('mb-1 w-full max-w-100', className)} {...props} />
);

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
