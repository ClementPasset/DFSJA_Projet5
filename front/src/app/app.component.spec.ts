import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService } from './services/session.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';


describe('AppComponent Unit Tests Suite', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockedSessionService = {
    $isLogged: jest.fn(),
    logOut: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockedSessionService }
      ]
    }).compileComponents();

    mockedSessionService.$isLogged.mockReturnValue(of(true));

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it('should create the app', () => {

    expect(app).toBeTruthy();

  });

  it("should display the nav bar for logged in users", () => {

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("span.link");

    expect(links.length).toBe(3);
    expect(links[0].textContent).toBe("Sessions");
    expect(links[1].textContent).toBe("Account");
    expect(links[2].textContent).toBe("Logout");

  });

  it("should display the navbar for users who are not logged in", () => {
    mockedSessionService.$isLogged.mockReturnValue(of(false));

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("span.link");

    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe("Login");
    expect(links[1].textContent).toBe("Register");
  });

  it("should call the SessionService to check if the user is logged", done => {

    jest.spyOn(mockedSessionService, "$isLogged");

    app.$isLogged().subscribe(value => {
      expect(value).toBe(true);
      done();
    });

    expect(mockedSessionService.$isLogged).toHaveBeenCalledTimes(1);

  });

  it("should log the user out", () => {

    jest.spyOn(router, "navigate");

    app.logout();

    expect(mockedSessionService.logOut).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['']);

  });
});
