import { Terms } from '@blockframes/right';
import { FormGroup, FormControl } from "@angular/forms";

export function createForm(terms: Terms[]) {
  const termsForm = new FormGroup({})
  for (const term of terms) {
    termsForm.addControl(term.id, new FormControl())
  }
  return new FormGroup({
    ticket: new FormGroup({
      amount: new FormControl(),
      price: new FormControl(),
    }),
    terms: termsForm
  });;
}