package com.openclassrooms.starterjwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.util.Date;

import javax.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private EmbeddedDatabase db;

    @BeforeEach
    private void setup() {
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

    @Test
    public void findById_shouldReturnTheRightSession() throws Exception {
        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session de test 1"));
    }

    @Test
    public void findAll_shouldReturnAllSessions() throws Exception {
        mockMvc.perform(get("/api/session/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Session de test 1"))
                .andExpect(jsonPath("$[1].name").value("Session de test 2"));
    }

    @Test
    public void create_shouldCreateASession() throws Exception {
        Session sessionToCreate = new Session();
        sessionToCreate.setName("Name of the new session");
        sessionToCreate.setDescription("Description of the new session");
        sessionToCreate.setDate(Date.from(Instant.now()));
        sessionToCreate.setTeacher(teacherRepository.getById(1L));
        SessionDto sessionDto = sessionMapper.toDto(sessionToCreate);

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value(sessionToCreate.getDescription()));
    }

    @Test
    public void update_shouldUpdateTheSession() throws Exception {
        Session sessionToUpdate = sessionRepository.getById(1L);
        sessionToUpdate.setDescription("Description mise à jour.");

        SessionDto sessionDto = sessionMapper.toDto(sessionToUpdate);

        mockMvc.perform(put("/api/session/" + sessionToUpdate.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value(sessionToUpdate.getDescription()));
    }

    @Test
    public void update_shouldReturnBadRequest() throws Exception {
        Session sessionToUpdate = sessionRepository.getById(1L);
        sessionToUpdate.setDescription("Description mise à jour.");

        SessionDto sessionDto = sessionMapper.toDto(sessionToUpdate);

        mockMvc.perform(put("/api/session/" + "stringContent")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void save_shouldDeleteTheSession() throws Exception {
        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());

        assertThat(sessionRepository.findById(1L)).isNotPresent();
    }

    @Test
    public void save_shouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void save_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete("/api/session/stringContent"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void participate_shouldAddUserToSession() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isOk());

        assertThat(sessionRepository.findById(1L).get().getUsers()).contains(userRepository.findById(1L).get());
    }

    @Test
    public void participate_shouldReturnNotFound() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void participate_shouldBadRequest() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/text"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void noLongerParticipate_shouldRemoveUserToSession() throws Exception {
        Session session = sessionRepository.getById(1L);
        User user = userRepository.getById(1L);
        session.getUsers().add(user);
        sessionRepository.save(session);

        assertThat(sessionRepository.findById(1L).get().getUsers()).contains(userRepository.findById(1L).get());

        mockMvc.perform(delete("/api/session/1/participate/1"))
                .andExpect(status().isOk());

        assertThat(sessionRepository.findById(1L).get().getUsers()).doesNotContain(userRepository.findById(1L).get());
    }

    @Test
    public void noLongerParticipate_shouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/999/participate/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void noLongerParticipate_shouldBadRequest() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/text"))
                .andExpect(status().isBadRequest());
    }

}
