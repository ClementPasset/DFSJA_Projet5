import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService Unit Tests Suite', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {

    expect(sessionService).toBeTruthy();

  });

  it("shouldn't be logged in at first", done => {

    sessionService.$isLogged().subscribe(value => {
      expect(value).not.toBe(true);
      expect(sessionService.sessionInformation).toBeFalsy();
      done();
    });

  });

  it("should log the user in", done => {

    const user: SessionInformation = {
      token: "token",
      type: "type",
      id: 1,
      username: "username",
      firstName: "firstName",
      lastName: "lastName",
      admin: false
    };

    sessionService.logIn(user);
    sessionService.$isLogged().subscribe(value => {
      expect(value).toBe(true);
      expect(sessionService.sessionInformation).toEqual(user);
      done();
    });

  });

  it("should log the user out", done => {

    const user: SessionInformation = {
      token: "token",
      type: "type",
      id: 1,
      username: "username",
      firstName: "firstName",
      lastName: "lastName",
      admin: false
    };

    sessionService.sessionInformation = user;
    sessionService.isLogged = true;

    sessionService.logOut();

    sessionService.$isLogged().subscribe(value => {
      expect(value).toBe(false);
      expect(sessionService.sessionInformation).toBeFalsy();
      done();
    });
    
  });
});
