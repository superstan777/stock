export interface ColumnOption {
  value: string;
  label: string;
  type?: "text" | "select";
  options?: string[]; // np. enum values
}
