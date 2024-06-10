package com.openclassrooms.starterjwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.security.Principal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private Principal principal;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private UserController userController;

    @Test
    public void findById_shouldReturnTheRightUser() {
        User user = new User();
        user.setFirstName("Admin");
        UserDto userDto = new UserDto();
        userDto.setFirstName("Admin");
        when(userService.findById(anyLong())).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(userDto);
    }

    @Test
    public void findById_shouldReturnNotFound() {
        User user = new User();
        user.setFirstName("Admin");
        when(userService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = userController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    public void findById_shouldReturnBadRequest() {
        ResponseEntity<?> response = userController.findById("test");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    public void save_shouldDeleteTheUser() {
        User user = new User();
        user.setEmail("email@mail.com");
        when(userService.findById(anyLong())).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("email@mail.com");
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    public void save_shouldReturnUnauthorized() {
        User user = new User();
        user.setEmail("differentEmail@mail.com");
        when(userService.findById(anyLong())).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("email@mail.com");
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(401);
    }

    @Test
    public void save_shouldReturnNotFound() {
        when(userService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    public void save_shouldReturnBadRequest() {

        ResponseEntity<?> response = userController.save("test");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }
}
