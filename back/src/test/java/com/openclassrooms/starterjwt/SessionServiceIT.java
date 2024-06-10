package com.openclassrooms.starterjwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
public class SessionServiceIT {

    @Autowired
    @Spy
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private TeacherService teacherService;

    private Session testSession;

    private EmbeddedDatabase db;

    @BeforeEach
    private void setup() {
        initiateTestSession();
        initiateDB();
    }

    @AfterEach
    public void tearDown() {
        this.db.shutdown();
    }

    private void initiateDB() {
        this.db = new EmbeddedDatabaseBuilder()
                .generateUniqueName(true)
                .setType(EmbeddedDatabaseType.H2)
                .setScriptEncoding("UTF-8")
                .ignoreFailedDrops(true)
                .addScript("schema.sql")
                .addScripts("data.sql")
                .build();
    }

    private void initiateTestSession() {
        this.testSession = new Session();
        this.testSession.setName("Nouvelle session");
        this.testSession.setDate(Date.from(Instant.now()));
        this.testSession.setDescription("Description de la nouvelle session de test");
        this.testSession.setTeacher(teacherService.findById(1L));
        this.testSession.setCreatedAt(LocalDateTime.now());
        this.testSession.setUpdatedAt(LocalDateTime.now());
        this.testSession.setUsers(new ArrayList<User>());
    }

    @Test
    public void create_shouldSaveSession() {
        Session newSession = sessionService.create(this.testSession);

        assertThat(newSession).isEqualTo(this.testSession);
        assertThat(sessionRepository.findById(newSession.getId())).isPresent();
    }

    @Test
    public void delete_shouldDeleteSession() {
        assertThat(sessionRepository.count()).isEqualTo(2);
        assertThat(sessionRepository.findById(1L)).isPresent();

        sessionService.delete(1L);

        assertThat(sessionRepository.count()).isEqualTo(1);
        assertThat(sessionRepository.findById(1L)).isNotPresent();
    }

    @Test
    public void findAll_shouldReturnAllSessions() {
        ArrayList<Session> sessionsList = new ArrayList<Session>(sessionService.findAll());

        assertThat(sessionsList.size()).isEqualTo(2);
        assertThat(sessionsList.get(0).getName()).isEqualTo("Session de test 1");
        assertThat(sessionsList.get(1).getDescription()).isEqualTo("Deuxième session de test");
    }

    @Test
    public void getById_shouldReturnTheRightSession() {
        Session firstSession = sessionService.getById(1L);
        Session secondSession = sessionService.getById(2L);

        assertThat(firstSession.getName()).isEqualTo("Session de test 1");
        assertThat(secondSession.getName()).isEqualTo("Session de test 2");
    }

    @Test
    public void update_shouldReturnUpdatedSession() {
        Session updatedSession = sessionService.update(2L, this.testSession);

        assertThat(updatedSession.getId()).isEqualTo(2);
        assertThat(updatedSession.getName()).isEqualTo(this.testSession.getName());
        assertThat(updatedSession.getDescription()).isEqualTo(this.testSession.getDescription());
    }

    @Test
    public void participate_shouldAddUserInSessionUsers() {
        Long sessionId = 2L;
        Long userId = 1L;

        sessionService.participate(sessionId, userId);
        Session session = sessionRepository.getById(sessionId);
        User user = userRepository.getById(userId);

        assertThat(session.getUsers()).contains(user);
    }

    @Test
    public void participate_shouldThrowNotFoundException() {
        Long sessionId = 999L;
        Long userId = 1L;

        assertThrows(NotFoundException.class, () -> {
            sessionService.participate(sessionId, userId);
        });
    }

    @Test
    public void participate_shouldThrowBadRequestException() {
        Long sessionId = 2L;
        Long userId = 1L;

        sessionService.participate(sessionId, userId);

        assertThrows(BadRequestException.class, () -> {
            sessionService.participate(sessionId, userId);
        });
    }

    @Test
    public void noLongerParticipate_shouldRemoveUserFromSessionUsers() {
        Long sessionId = 2L;
        Long userId = 1L;

        sessionService.participate(sessionId, userId);
        sessionService.noLongerParticipate(sessionId, userId);
        Session session = sessionRepository.getById(sessionId);
        User user = userRepository.getById(userId);

        assertThat(session.getUsers()).doesNotContain(user);
    }

    @Test
    public void noLongerParticipate_shouldThrowNotFoundException() {
        Long sessionId = 999L;
        Long userId = 999L;

        assertThrows(NotFoundException.class, () -> {
            sessionService.noLongerParticipate(sessionId, userId);
        });
    }

    @Test
    public void noLongerParticipate_shouldThrowBadRequestException() {
        Long sessionId = 2L;
        Long userId = 1L;

        assertThrows(BadRequestException.class, () -> {
            sessionService.noLongerParticipate(sessionId, userId);
        });
    }
}
