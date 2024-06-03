import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';


describe('UserService Unit Tests Suite', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {

    expect(userService).toBeTruthy();

  });

  it("should get the user", done => {

    const mockedUser = {
      id: 1,
      email: "email@email.com",
      lastName: "lastName",
      firstName: "firstName",
      admin: false,
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    userService.getById("1").subscribe(data => {
      expect(data).toEqual(mockedUser);
      done();
    });

    const req = httpTestingController.expectOne("api/user/1");
    expect(req.request.method).toBe("GET");

    req.flush(mockedUser);

  })

  it("should delete the user", () => {

    userService.delete("1").subscribe();

    const req = httpTestingController.expectOne("api/user/1");
    expect(req.request.method).toBe("DELETE");

  });
});
