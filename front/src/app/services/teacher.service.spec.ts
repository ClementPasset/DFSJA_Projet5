import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService Unit Tests Suite', () => {
  let teacherService: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    teacherService = TestBed.inject(TeacherService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {

    expect(teacherService).toBeTruthy();

  });

  it("should get all teachers", done => {

    const mockedTeachers: Teacher[] = [
      {
        id: 1,
        lastName: "lastName",
        firstName: "firstName",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        lastName: "lastName",
        firstName: "firstName",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    teacherService.all().subscribe(data => {
      expect(data).toEqual(mockedTeachers);
      done();
    });

    const req = httpTestingController.expectOne("api/teacher");
    expect(req.request.method).toBe("GET");

    req.flush(mockedTeachers);

  });

  it("should get the details of a teacher", done => {

    const mockedTeacher: Teacher = {
      id: 1,
      lastName: "lastName",
      firstName: "firstName",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    teacherService.detail("1").subscribe(data => {
      expect(data).toEqual(mockedTeacher);
      done();
    })

    const req = httpTestingController.expectOne("api/teacher/1");
    expect(req.request.method).toBe("GET");

    req.flush(mockedTeacher);

  })
});
