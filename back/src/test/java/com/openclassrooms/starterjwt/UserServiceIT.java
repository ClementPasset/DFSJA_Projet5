package com.openclassrooms.starterjwt;

import static org.assertj.core.api.Assertions.assertThat;

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

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
public class UserServiceIT {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

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
    public void delete_shouldRemoveUser() {
        assertThat(userRepository.findById(1L)).isPresent();

        userService.delete(1L);

        assertThat(userRepository.findById(1L)).isNotPresent();
    }

    @Test
    public void findById_shouldReturnTheRightUser(){
        User user = userService.findById(1L);

        assertThat(user.getFirstName()).isEqualTo("Admin");
        assertThat(user.getLastName()).isEqualTo("Admin");
    }

    @Test
    public void findById_shouldReturnNull(){
        User user = userService.findById(999L);

        assertThat(user).isNull();;
    }
}
