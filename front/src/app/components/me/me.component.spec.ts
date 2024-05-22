import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('MeComponent Unit Tests Suite', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let getByIdSpy: any;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1
    },
    logOut: jest.fn()
  };

  const mockedUser = {
    id: 1,
    email: "jean@dupont.com",
    lastName: "Dupont",
    firstName: "Jean",
    admin: false,
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockedAdminUser = {
    id: 2,
    email: "jean@admin.com",
    lastName: "Admin",
    firstName: "Jean",
    admin: true,
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUserService = {
    getById: (id: String) => {
      if (id === "2") {
        return of(mockedAdminUser);
      } else {
        return of(mockedUser);
      }
    },
    delete: () => of(null)
  };

  const mockMatSnackBar = {
    open: jest.fn()
  }

  beforeEach(async () => {
    getByIdSpy = jest.spyOn(mockUserService, "getById");

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
    })
      .compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
    expect(getByIdSpy).toHaveBeenCalledTimes(1);
    expect(getByIdSpy).toHaveBeenCalledWith(mockedUser.id.toString());
    expect(component.user).toEqual(mockedUser);

    const title = fixture.nativeElement.querySelector("h1");
    expect(title.textContent).toBe("User information");

    const [name, mail] = fixture.nativeElement.querySelectorAll("mat-card-content div p");
    expect(name.textContent).toBe(`Name: ${mockedUser.firstName} ${mockedUser.lastName.toUpperCase()}`);
    expect(mail.textContent).toBe(`Email: ${mockedUser.email}`);

  });

  it("should go back", () => {

    jest.spyOn(window.history, "back");

    const backButton = fixture.nativeElement.querySelector("button[mat-icon-button]");
    backButton.click();

    expect(window.history.back).toHaveBeenCalledTimes(1);

  });

  it("should delete user if he is not an admin", done => {

    jest.spyOn(mockUserService, "delete");
    jest.spyOn(mockSessionService, "logOut");
    jest.spyOn(mockMatSnackBar, "open");
    jest.spyOn(router, "navigate");

    const deleteButton = fixture.nativeElement.querySelector("button[color='warn']");
    deleteButton.click();

    expect(mockUserService.delete).toHaveBeenCalledTimes(1);
    expect(mockUserService.delete).toHaveBeenCalledWith(mockedUser.id.toString());
    expect(mockMatSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(["/"]);

    router.navigate(["/"])
      .then(() => {
        expect(router.url).toEqual("/");
        done();
      })

  });

  it("should not display the delete button for admins", () => {

    component.user = mockedAdminUser;

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector("button[color='warn']");

    expect(deleteButton).toBeFalsy();

  });

  it("should display 'You are admin' message for admins", () => {

    component.user = mockedAdminUser;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("p.my2").textContent).toBe("You are admin");

  });

  it("should not display 'You are admin' message for non-admin users", () => {

    component.user = mockedUser;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("p.my2")).toBeFalsy();

  });
});
