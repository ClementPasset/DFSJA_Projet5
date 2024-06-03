import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { Router } from '@angular/router';
import { SessionsModule } from 'src/app/features/sessions/sessions.module';

describe('LoginComponent Unit Tests Suite', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  let mockedSessionService = {
    logIn: jest.fn()
  };

  let mockedAuthService = {
    login: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockedSessionService },
        { provide: AuthService, useValue: mockedAuthService }
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "sessions", component: SessionsModule }
        ]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the form and the controls', () => {

    expect(component).toBeTruthy();
    expect(component.hide).toBe(true);
    expect(component.onError).toBe(false);
    expect(fixture.nativeElement.querySelector("mat-card-title")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("mat-card-title").textContent).toBe("Login");

    const inputs = fixture.nativeElement.querySelectorAll("mat-form-field input");
    expect(inputs.length).toBe(2);
    expect(inputs[0].getAttribute("formControlName")).toBe("email");
    expect(inputs[1].getAttribute("formControlName")).toBe("password");
    expect(fixture.nativeElement.querySelector("button[type='submit']")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button[type='submit']").textContent).toBe("Submit");

  });

  it("should be invalid if the form is empty", () => {

    expect(component.form.valid).toBeFalsy();

  });

  it("should be valid", () => {

    component.form.controls["email"].setValue("email@email.com");
    component.form.controls["password"].setValue("password123!");

    expect(component.form.valid).toBeTruthy();

  });

  it("should submit the form", () => {

    mockedAuthService.login.mockReturnValueOnce(of({ token: "12345" } as SessionInformation));

    component.form.controls["email"].setValue("email@email.com");
    component.form.controls["password"].setValue("password123!");

    const mockedLoginRequest = { email: "email@email.com", password: "password123!" } as LoginRequest;

    component.submit();

    expect(mockedAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockedAuthService.login).toHaveBeenCalledWith(mockedLoginRequest);

  });

  it("should redirect the user when the form is submitted succesfully", () => {

    mockedAuthService.login.mockReturnValueOnce(of({ token: "12345" } as SessionInformation));
    jest.spyOn(router, "navigate");

    component.form.controls["email"].setValue("email@email.com");
    component.form.controls["password"].setValue("password123!");

    component.submit();

    expect(mockedSessionService.logIn).toHaveBeenCalledTimes(1);
    expect(mockedSessionService.logIn).toHaveBeenCalledWith({ token: "12345" } as SessionInformation);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(["/sessions"]);

  });

  it("should display an error message if the login fails", () => {

    mockedAuthService.login.mockReturnValueOnce(throwError(() => new Error("Error while trying to log in.")));

    component.form.controls["email"].setValue("email@email.com");
    component.form.controls["password"].setValue("password123!");

    component.submit();

    fixture.detectChanges();

    expect(component.onError).toBe(true);
    expect(fixture.nativeElement.querySelector("p.error")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("p.error").textContent).toBe("An error occurred");

  });
});
