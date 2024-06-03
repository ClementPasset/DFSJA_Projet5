import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RegisterRequest } from "../interfaces/registerRequest.interface";
import { expect } from '@jest/globals';
import { LoginRequest } from "../interfaces/loginRequest.interface";
import { SessionInformation } from "src/app/interfaces/sessionInformation.interface";

describe("AuthService Unit Tests Suite", () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {

    expect(authService).toBeTruthy();

  });

  it("should register the user", () => {

    const mockRequest: RegisterRequest = {
      email: "email@email.com",
      firstName: "firstName",
      lastName: "lastName",
      password: "password"
    };

    authService.register(mockRequest).subscribe();

    const req = httpTestingController.expectOne("api/auth/register");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockRequest);

  });

  it("should log the user in", done => {

    const mockRequest: LoginRequest = {
      email: "email@email.com",
      password: "password"
    };

    const mockSessionInformation: SessionInformation = {
      token: "token",
      type: "type",
      id: 1,
      username: "username",
      firstName: "firstName",
      lastName: "lastName",
      admin: false
    }

    authService.login(mockRequest).subscribe(data => {
      expect(data).toEqual(mockSessionInformation);
      done();
    });

    const req = httpTestingController.expectOne("api/auth/login");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockSessionInformation);

  });
});