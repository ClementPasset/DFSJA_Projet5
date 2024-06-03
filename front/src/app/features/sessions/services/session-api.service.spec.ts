import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService Unit Tests Suit ', () => {
  let sessionApiService: SessionApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    sessionApiService = TestBed.inject(SessionApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {

    expect(sessionApiService).toBeTruthy();

  });

  it("should get all sessions", done => {

    const mockSessions: Session[] = [
      {
        id: 1,
        name: "name",
        description: "description",
        date: new Date(),
        teacher_id: 1,
        users: [1, 2, 3]
      },
      {
        id: 2,
        name: "name 2",
        description: "description 2",
        date: new Date(),
        teacher_id: 2,
        users: [1, 2, 3]
      }
    ];

    sessionApiService.all().subscribe(data => {
      expect(data).toEqual(mockSessions);
      done();
    });

    const req = httpTestingController.expectOne("api/session");
    expect(req.request.method).toBe("GET");

    req.flush(mockSessions);

  });

  it("should get the details of a session", done => {

    const mockSession = {
      id: 1,
      name: "name",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3]
    }

    sessionApiService.detail("1").subscribe(data => {
      expect(data).toEqual(mockSession);
      done();
    });

    const req = httpTestingController.expectOne("api/session/1");
    expect(req.request.method).toBe("GET");

    req.flush(mockSession);

  });

  it("should delete a session", () => {

    sessionApiService.delete("1").subscribe();

    const req = httpTestingController.expectOne("api/session/1");
    expect(req.request.method).toBe("DELETE");

  });

  it("should create a session", done => {

    const mockSession = {
      id: 1,
      name: "name",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3]
    };

    sessionApiService.create(mockSession).subscribe(data => {
      expect(data).toEqual(mockSession);
      done();
    })

    const req = httpTestingController.expectOne("api/session");
    expect(req.request.method).toBe("POST");

    req.flush(mockSession);

  });

  it("should update a session", done => {

    const mockSession = {
      id: 1,
      name: "name",
      description: "description",
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3]
    };

    sessionApiService.update("1", mockSession).subscribe(data => {
      expect(data).toEqual(mockSession);
      done();
    });

    const req = httpTestingController.expectOne("api/session/1");
    expect(req.request.method).toBe("PUT");

    req.flush(mockSession);

  });

  it("should create a participation", () => {

    sessionApiService.participate("4", "1").subscribe();

    const req = httpTestingController.expectOne("api/session/4/participate/1");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toBeNull();

  });

  it("should delete a participation", () => {

    sessionApiService.unParticipate("4", "1").subscribe();

    const req = httpTestingController.expectOne("api/session/4/participate/1");
    expect(req.request.method).toBe("DELETE");

  });
});
