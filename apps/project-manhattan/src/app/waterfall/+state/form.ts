import { Terms } from '@blockframes/right';
import { FormGroup, FormControl, Validators } from "@angular/forms";

export function createForm(terms: Terms[]) {
  const termsForm = new FormGroup({})
  for (const term of terms) {
    termsForm.addControl(term.id, new FormControl())
  }
  return new FormGroup({
    multiplier: new FormControl(1),
    name: new FormControl(),
    ticket: new FormGroup({
      amount: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    }),
    terms: termsForm
  });
}

