import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

// Label + input slot + helper text, keeps every field consistent
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label htmlFor={id} className="text-sm font-bold">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-accent-red">{error}</p>}
    </div>
  );
}
