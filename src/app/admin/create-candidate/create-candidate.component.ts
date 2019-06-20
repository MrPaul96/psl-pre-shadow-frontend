import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/user';
import { AlertService } from '../../shared/notifications/alert.service';
import { AdminHelperService } from '../services/admin-helper.service';
import { Subscription } from 'rxjs';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.scss']
})
export class CreateCandidateComponent implements OnInit {
  @ViewChild(CandidateFormComponent) CandidateFormComponent: CandidateFormComponent;
  user: User;
  softwareRoles: string[];
  authRegisterSubscription: Subscription;
  action: string;
  userToCreate: User;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private adminHelper: AdminHelperService
  ) { }

  ngOnInit() {
    this.softwareRoles = this.adminHelper.getSoftwareRoles();
    this.user = this.adminHelper.getUserRebooted();
    this.action = 'creation';
  }

  getFormOutput($userEmmited) {
    this.userToCreate = { ...$userEmmited };
    this.createCandidate();
  }

  createCandidate() {
    this.authRegisterSubscription = this.authService.registerUser(this.userToCreate).subscribe(
      () => {
        this.alertService.showSuccessMessage('User succesfully created');
        this.CandidateFormComponent.goBack();
      },
      error => {
        this.alertService.showInvalidMessage(error.message);
      }
    );
  }
}
