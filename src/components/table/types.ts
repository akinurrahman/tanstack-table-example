import { ColumnDef } from "@tanstack/react-table";

export type ExtendedColumnDef<T> = ColumnDef<T> & {
  width?: string;
  isEditable?: boolean;
  meta?: {
    fieldType?: string;
    options?: { label: string; value: any }[];
  };
};

export type TableProps<T extends object> = {
  columns: ExtendedColumnDef<T>[];
  data: T[];
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowEdit?: (row: T) => Promise<void>;
  onRedirect?: (row: T) => void;
  ITEMS_PER_PAGE?: number;
};
