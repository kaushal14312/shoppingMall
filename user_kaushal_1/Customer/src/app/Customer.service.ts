import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  API = "http://localhost:8088";  // Base API URL

  constructor(private http: HttpClient) {}

  /**
   * Registers a new customer.
   * @param customerData - The customer data to register.
   */
  public registerCustomer(customerData: any) {
    return this.http.post(`${this.API}/customers`, customerData);
  }

  /**
   * Fetches all customers from the backend.
   */
  public getCustomers() {
    return this.http.get(`${this.API}/customers`);
  }

  /**
   * Deletes a customer by ID.
   * @param customerId - The ID of the customer to delete.
   */
  public deleteCustomer(customerId: number) {
    return this.http.delete(`${this.API}/customers/${customerId}`);
  }

  /**
   * Updates a customer's details.
   * @param customer - The updated customer data.
   */
  public updateCustomer(customer: any) {
    const customerId = customer.CustomerId; // Use `CustomerId` extracted in the component
    if (!customerId) {
      throw new Error('Customer ID is required for updating customer data.');
    }
    return this.http.put(`${this.API}/customers/${customerId}`, customer);
  }
}
