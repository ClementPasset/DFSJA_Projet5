package com.openclassrooms.starterjwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    @Test
    public void findById_shouldReturnTheRightTeacher() {
        Teacher teacher = new Teacher();
        TeacherDto teacherDto = new TeacherDto();
        when(teacherService.findById(anyLong())).thenReturn(teacher);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(teacherDto);
    }

    @Test
    public void findById_shouldReturnNotFound() {
        when(teacherService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    public void findById_shouldReturnBadRequest() {
        ResponseEntity<?> response = teacherController.findById("test");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    public void findAll_shouldReturnAllTeachers() {
        Teacher firstTeacher = new Teacher();
        Teacher secondTeacher = new Teacher();
        firstTeacher.setFirstName("John");
        secondTeacher.setFirstName("Jane");
        List<Teacher> teachers = Arrays.asList(firstTeacher, secondTeacher);
        TeacherDto firstTeacherDto = new TeacherDto();
        TeacherDto secondTeacherDto = new TeacherDto();
        firstTeacherDto.setFirstName("John");
        secondTeacherDto.setFirstName("Jane");
        List<TeacherDto> teachersDto = Arrays.asList(firstTeacherDto, secondTeacherDto);
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teachersDto);

        ResponseEntity<?> response = teacherController.findAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        System.out.println("LEBODY: " + response.getBody().toString());
        assertThat(response.getBody()).isEqualTo(teachersDto);
    }

}
