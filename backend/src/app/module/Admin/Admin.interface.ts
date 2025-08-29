export interface Admin {
  id: number;
  name: string;
  email: string;
  portfolio_image: string | null;
  contact_number: string | null;
  isdelete: boolean;
  created_at: Date;
  updated_at: Date;
}
