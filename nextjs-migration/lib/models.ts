export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string; // ISO
  email_sent: boolean;
  read: boolean;
};

export type AdminLoginResponse = {
  token: string;
  expires_at: string;
};

export type AdminStats = {
  total: number;
  unread: number;
};
