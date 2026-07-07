export interface Address {
  id: string;
  label: string;         // e.g. 'Home', 'Work'
  fullName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/** DTO used when creating or updating an address (no id required). */
export type AddressPayload = Omit<Address, 'id'>;
