import { Contact } from "./Contact";

export interface Asset {
  id?: string;
  code: string;
  contact: Contact;
}
