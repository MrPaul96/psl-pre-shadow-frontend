import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidation } from '../validators/passwordValidator';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminHelperService {

  private candidates: User[];
  private criteriaOptions: string[] = [
    'name',
    'email',
    'age',
    'startDate',
    'releaseDate',
    'preference'
  ];

  private softwareRoles: string[] = ['Frontend', 'Backend', 'QA', 'DevOps', 'Business Analyst'];

  getCandidateFormValidators(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      age: new FormControl('', [Validators.required, Validators.min(18)]),
      username: new FormControl('', [Validators.required, Validators.min(3)]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      cpassword: new FormControl('', Validators.required),
      start_date: new FormControl('', [Validators.required]),
      release_date: new FormControl('', [Validators.required]),
      preference: new FormControl('', [Validators.required])
    },
      {
        validators: PasswordValidation.MatchPassword
      }
    );
  }

  setCandidates(candidates: User[]): void{
    this.candidates = candidates;
  }

  getCandidates(): User[] {
    return this.candidates;
  }

  getCriteraOptions(): string[] {
    return this.criteriaOptions;
  }

  getSoftwareRoles(): string[] {
    return this.softwareRoles;
  }
}
