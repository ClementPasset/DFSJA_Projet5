import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormComponent } from '../form/form.component';
import { DetailComponent } from '../detail/detail.component';

describe('ListComponent Unit Tests Suite', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockedSessions: Session[] = [
    {
      name: "Session 1",
      description: "This is the first session",
      date: new Date(),
      teacher_id: 1,
      users: []
    },
    {
      name: "Session 2",
      description: "This is the second session",
      date: new Date(),
      teacher_id: 2,
      users: []
    }
  ];

  const mockedSessionsApiService = {
    all: () => of(mockedSessions)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule.withRoutes([
        { path: "create", component: FormComponent },
        { path: "update/:id", component: FormComponent },
        { path: "detail/:id", component: DetailComponent }
      ])],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockedSessionsApiService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it("should get all the sessions and display them", () => {

    const sessions = fixture.nativeElement.querySelectorAll("mat-card.item");
    const sessionsTitle = fixture.nativeElement.querySelectorAll("mat-card.item mat-card-title");
    expect(sessions.length).toBe(2);
    expect(sessionsTitle[0].textContent).toBe("Session 1");
    expect(sessionsTitle[1].textContent).toBe("Session 2");

  });

  it("should display edit buttons and Create button for admins", () => {
    //TODO
  });

  it("should not display the edit buttons and Create button for non-admins", () => {
    //TODO
  });
});
