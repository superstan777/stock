import { Label } from "./label";

export const FormField: React.FC<{
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}> = ({ id, label, children, error }) => (
  <div className="grid gap-3">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-red-600 text-sm">{error}</p>}
  </div>
);
