import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from 'src/app/features/sessions/components/list/list.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

describe('RegisterComponent Unit Tests Suite', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const mockedAuthService = {
    register: jest.fn(() => of(null))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule.withRoutes([
          { path: "", component: ListComponent },
          { path: "login", component: LoginComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService }
      ]
    })
      .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the form and the controls', () => {

    expect(component).toBeTruthy();
    expect(component.onError).toBe(false);
    expect(fixture.nativeElement.querySelector(".register-form")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[formControlName='firstName']")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[formControlName='lastName']")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[formControlName='email']")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[formControlName='password']")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button[type='submit']").textContent).toBe("Submit");
    expect(fixture.nativeElement.querySelector("span.error.ml2")).toBeFalsy();

  });

  it("should submit the form", () => {

    component.form.controls['firstName'].setValue("testFirstName");
    component.form.controls['lastName'].setValue("testLastName");
    component.form.controls['email'].setValue("test@mail.com");
    component.form.controls['password'].setValue("testPassword");

    const mockedRegisterRequest = {
      firstName: "testFirstName",
      lastName: "testLastName",
      email: "test@mail.com",
      password: "testPassword"
    } as RegisterRequest;

    component.submit();

    expect(mockedAuthService.register).toHaveBeenCalledTimes(1);
    expect(mockedAuthService.register).toHaveBeenCalledWith(mockedRegisterRequest);

  });

  it("should redirect when the response is ok", () => {

    jest.spyOn(router, "navigate");

    component.form.controls['firstName'].setValue("testFirstName");
    component.form.controls['lastName'].setValue("testLastName");
    component.form.controls['email'].setValue("test@mail.com");
    component.form.controls['password'].setValue("testPassword");

    component.submit();

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);

  });

  it("should display an error", () => {

    mockedAuthService.register.mockReturnValueOnce(throwError(() => new Error("An error occured.")));

    component.form.controls['firstName'].setValue("testFirstName");
    component.form.controls['lastName'].setValue("testLastName");
    component.form.controls['email'].setValue("test@mail.com");
    component.form.controls['password'].setValue("testPassword");

    component.submit();

    fixture.detectChanges();

    expect(component.onError).toBe(true);

    expect(fixture.nativeElement.querySelector("span.error.ml2")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("span.error.ml2").textContent).toBe("An error occurred");

  });
});
