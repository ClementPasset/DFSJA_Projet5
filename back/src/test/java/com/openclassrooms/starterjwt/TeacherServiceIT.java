package com.openclassrooms.starterjwt;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;

import javax.transaction.Transactional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
public class TeacherServiceIT {

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    TeacherService teacherService;

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
    public void findAll_shouldReturnAllTeachers() {
        ArrayList<Teacher> teachers = new ArrayList<Teacher>(teacherService.findAll());

        assertThat(teachers.get(0).getFirstName()).isEqualTo("Margot");
        assertThat(teachers.get(1).getLastName()).isEqualTo("THIERCELIN");
    }

    @Test
    public void findById_shouldReturnTheRightTeacher() {
        Teacher firstTeacher = teacherService.findById(1L);
        Teacher secondTeacher = teacherService.findById(2L);

        assertThat(firstTeacher.getLastName()).isEqualTo("DELAHAYE");
        assertThat(secondTeacher.getFirstName()).isEqualTo("Hélène");
    }

    @Test
    public void findById_shouldReturnNull() {
        Teacher firstTeacher = teacherService.findById(999L);

        assertThat(firstTeacher).isNull();
    }
}
