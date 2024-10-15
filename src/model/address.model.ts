export class AddressResponse {
  id: string;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}
export class CreateAddressRequest {
  contact_id: string;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}
export class GetAddressRequest {
  contact_id: string;
  address_id: string;
}
