import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from '../list/list.component';


describe('DetailComponent Unit Tests Suite', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockedSession: Session = {
    name: "Yoga session 1",
    description: "first session",
    date: new Date(),
    teacher_id: 1,
    users: []
  };

  const mockedSessionApiService = {
    detail: jest.fn(() => of(mockedSession)),
    delete: jest.fn(() => of({})),
    participate: jest.fn(() => of({})),
    unParticipate: jest.fn(() => of({}))
  };

  const mockedTeacher: Teacher = {
    id: 1,
    firstName: "Jean",
    lastName: "DUPONT",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockedTeacherService = {
    detail: jest.fn(() => of(mockedTeacher))
  };

  const mockedActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn(() => "1")
      }
    }
  };

  const mockedSnackBar = {
    open: jest.fn()
  };

  const materialModules = [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: "sessions", component: ListComponent }]),
        HttpClientModule,
        ...materialModules,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockedSessionApiService },
        { provide: TeacherService, useValue: mockedTeacherService },
        { provide: ActivatedRoute, useValue: mockedActivatedRoute },
        { provide: MatSnackBar, useValue: mockedSnackBar }
      ],
    })
      .compileComponents();
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
    expect(component.sessionId).toBe("1");
    expect(component.isAdmin).toBe(true);
    expect(component.userId).toBe("1");
    expect(component.isParticipate).toBe(false);
    expect(mockedSessionApiService.detail).toHaveBeenCalledTimes(1);
    expect(mockedSessionApiService.detail).toHaveBeenCalledWith("1");

  });

  it("should go back", () => {

    jest.spyOn(window.history, "back");

    component.back();

    expect(window.history.back).toHaveBeenCalledTimes(1);

  });

  it("should delete the session and go to the sessions' list", () => {

    component.delete();

    expect(mockedSessionApiService.delete).toHaveBeenCalledWith("1")

  });

  it("should display participate button", () => {

    component.isAdmin = false;
    fixture.detectChanges();

    const participationButton = fixture.nativeElement.querySelector("button span.ml1");

    expect(participationButton).toBeTruthy();
    expect(participationButton.textContent).toBe("Participate");

  });

  it("should display unparticipate button", () => {

    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    const participationButton = fixture.nativeElement.querySelector("button span.ml1");

    expect(participationButton).toBeTruthy();
    expect(participationButton.textContent).toBe("Do not participate");

  });

  it("should participate to the session", () => {

    component.participate();

    expect(mockedSessionApiService.participate).toHaveBeenCalledTimes(1);
    expect(mockedSessionApiService.participate).toHaveBeenCalledWith("1", "1");

  });

  it("should unparticipate to the session", () => {

    component.unParticipate();

    expect(mockedSessionApiService.unParticipate).toHaveBeenCalledTimes(1);
    expect(mockedSessionApiService.unParticipate).toHaveBeenCalledWith("1", "1");

  });

  it("should display the delete button for admin users", () => {

    const deleteButton = fixture.nativeElement.querySelector("button span.ml1");

    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toBe("Delete");

  });

  it("should delete the session", async () => {

    jest.spyOn(router, 'navigate');

    await component.delete();

    expect(mockedSessionApiService.delete).toHaveBeenCalledTimes(1);
    expect(mockedSessionApiService.delete).toHaveBeenCalledWith("1");
    expect(mockedSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockedSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(["sessions"]);

  });

  it("shouldn't display the delete button for non-admin users", () => {

    component.isAdmin = false;
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector("button[color='warn']");
    expect(deleteButton).toBeFalsy();

  });
});

