import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from '../list/list.component';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent Unit Tests Suite', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockSessionApiService = {
    create: jest.fn(() => of({})),
    update: jest.fn(() => of({})),
    detail: jest.fn(() => of(mockedSession))
  };

  const mockedActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn(() => "1")
      }
    }
  };

  const mockedSession: Session = {
    name: "Session to update",
    date: new Date(),
    teacher_id: 1,
    description: "La session mockée",
    users: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule.withRoutes([
          { path: "sessions", component: ListComponent }
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true })
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: mockedActivatedRoute }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();

  });

  it("should redirect non-admin users", () => {

    jest.spyOn(router, "navigate");

    mockSessionService.sessionInformation!.admin = false;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);

  });

  it("should initialize the 'create' form", () => {

    expect(component.sessionForm).toBeTruthy();
    expect(component.sessionForm?.controls["name"].value).toBe("");
    expect(component.sessionForm?.controls["date"].value).toBe("");
    expect(component.sessionForm?.controls["teacher_id"].value).toBe("");
    expect(component.sessionForm?.controls["description"].value).toBe("");

  });

  it("should initialize the 'update' form", () => {

    jest.spyOn(router, "url", "get").mockReturnValueOnce("/session/update/1");

    component.ngOnInit();

    expect(component.sessionForm).toBeTruthy();
    expect(component.sessionForm?.controls["name"].value).toBe(mockedSession.name);
    expect(component.sessionForm?.controls["teacher_id"].value).toBe(mockedSession.teacher_id);
    expect(component.sessionForm?.controls["description"].value).toBe(mockedSession.description);

  });

  it("should display 'creation' form", () => {

    const title = fixture.nativeElement.querySelector("h1");

    expect(title.textContent).toBe("Create session");

  });

  it("should display 'updating' form", () => {

    component.onUpdate = true;
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h1");

    expect(title.textContent).toBe("Update session");
  });

  it("should create a session", () => {

    component.sessionForm?.controls["name"].setValue("Nouvelle session de yoga");
    component.sessionForm?.controls["date"].setValue(new Date().toISOString().split('T')[0]);
    component.sessionForm?.controls["teacher_id"].setValue("1");
    component.sessionForm?.controls["description"].setValue("Description de la session");
    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value as Session);

  });

  it("should update the session", () => {

    jest.spyOn(router, "url", "get").mockReturnValueOnce("/session/update/1");

    component.ngOnInit();

    component.sessionForm?.controls["name"].setValue("Nouvelle session de yoga");
    component.sessionForm?.controls["date"].setValue(new Date().toISOString().split('T')[0]);
    component.sessionForm?.controls["teacher_id"].setValue("1");
    component.sessionForm?.controls["description"].setValue("Description de la session");
    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalledWith("1", component.sessionForm?.value as Session);

  });

  it("should display an error if a required field is missing", () => {

    component.sessionForm?.controls["name"].setValue("Nouvelle session de yoga");
    component.sessionForm?.controls["date"].setValue(new Date().toISOString().split('T')[0]);
    component.sessionForm?.controls["description"].setValue("Description de la session");
    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith(component.sessionForm?.value as Session);

  });
});
