import { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  hint?: string;
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(({ label, error, as = 'input', rows = 4, hint, ...props }, ref) => {
  const baseClass =
    'w-full rounded-lg border px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition min-h-[44px] ' +
    (error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white');

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {as === 'textarea' ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          className={baseClass + ' resize-y'}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
          className={baseClass}
        />
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

FormField.displayName = 'FormField';
