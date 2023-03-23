export interface MailInterface {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html: string;
  cc?: string;
  bcc?: string;
}
