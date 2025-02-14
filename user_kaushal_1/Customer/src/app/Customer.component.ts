import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomerService } from './Customer.service';

interface Customer {
  CustomerId: number | null;  // Matches backend primary key
  name: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-Customer-root',
  templateUrl: './Customer.component.html',
  styleUrls: ['./Customer.component.scss']
})
export class CustomerComponent implements OnInit {
  title = 'customers';

  constructor(private customerService: CustomerService) {}

  customers: Customer[] = [];
  customerToUpdate: Customer = {
    CustomerId: null,
    name: '',
    email: '',
    phoneNumber: ''
  };

  ngOnInit(): void {
    this.getCustomers();
  }

  /**
   * Registers a new Customer using the provided form data.
   * @param registerForm The form containing customer data.
   */
  register(registerForm: NgForm): void {
    this.customerService.registerCustomer(registerForm.value).subscribe(
      () => {
        registerForm.reset();
        this.getCustomers();
      },
      error => console.error('Error registering customer:', error)
    );
  }

  /**
   * Fetches all customers from the backend and updates the local state.
   */
  getCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (response: any) => {
        if (response._embedded?.customers) {
          this.customers = response._embedded.customers.map((customer: any) => {
            // Extract CustomerId from the _links.self.href field
            const id = customer._links?.self?.href.split('/').pop();
            return {
              CustomerId: id ? parseInt(id, 10) : null, // Parse ID as a number
              name: customer.name || '',
              email: customer.email || '',
              phoneNumber: customer.phoneNumber || ''
            };
          });
          console.log('Processed customers:', this.customers); // Debug
        } else {
          this.customers = [];
        }
      },
      error => console.error('Error fetching customers:', error)
    );
  }

  /**
   * Deletes a customer by ID.
   * @param customer The customer to delete.
   */
  deleteCustomer(customer: Customer): void {
    if (!customer.CustomerId) {
      console.error('Customer ID is undefined. Cannot delete customer.', customer);
      return;
    }
    this.customerService.deleteCustomer(customer.CustomerId).subscribe(
      () => {
        console.log('Customer deleted successfully.');
        this.getCustomers();
      },
      error => {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
      }
    );
  }

  /**
   * Sets the customerToUpdate object for editing.
   * @param customer The customer to edit.
   */
  edit(customer: Customer): void {
    this.customerToUpdate = { ...customer };
  }

  /**
   * Updates an existing customer with the current customerToUpdate values.
   */
  updateCustomer(): void {
    if (this.customerToUpdate.CustomerId) {
      this.customerService.updateCustomer(this.customerToUpdate).subscribe(
        () => {
          console.log('Customer updated successfully.');
          this.getCustomers();
          this.customerToUpdate = {
            CustomerId: null,
            name: '',
            email: '',
            phoneNumber: ''
          }; // Reset after successful update
        },
        error => {
          console.error('Error updating customer:', error);
          alert('Error updating customer');
        }
      );
    } else {
      console.error('Customer ID is undefined. Cannot update customer.');
      alert('Customer ID is undefined. Cannot update customer.');
    }
  }
}
