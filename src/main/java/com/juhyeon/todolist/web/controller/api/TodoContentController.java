package com.juhyeon.todolist.web.controller.api;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.juhyeon.todolist.service.todo.TodoService;
import com.juhyeon.todolist.web.dto.CMRespDto;
import com.juhyeon.todolist.web.dto.todo.CreateTodoReqDto;
import com.juhyeon.todolist.web.dto.todo.TodoListRespDto;
import com.juhyeon.todolist.web.dto.todo.UpdateTodoReqDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/todolist")
@RequiredArgsConstructor
public class TodoContentController {
	
	private final TodoService todoService;
	@GetMapping("/list")
	public ResponseEntity<?> getTodoList(@RequestParam int page, @RequestParam int contentCount){
		
		List<TodoListRespDto> list = null;
		try {
			list = todoService.getTodoList(page, contentCount);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,page+"page list on load failed", list));
		}
		
		
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,page+"page list success to load", list));
		
		
	}
	
	@GetMapping("/list/importance")
	public ResponseEntity<?> getImportanceTodoList(@RequestParam int page, @RequestParam int contentCount){
		List<TodoListRespDto> list = null;
		
		try {
			list = todoService.getImportanceTodoList(page, contentCount);
		} catch (Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,page+"page importance list on load failed", list));
		}
		
		
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,page+"page importance list success to load", list));
	}
	
	@PostMapping("/todo")
	public ResponseEntity<?> addTodo(@RequestBody CreateTodoReqDto createTodoReqDto){
		try {
			if(!todoService.createTodo(createTodoReqDto)) {
				throw new RuntimeException("DataBase Error");
			}
		} catch (Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,"Adding Todo faile",createTodoReqDto));
		}
		return ResponseEntity.ok().body(new CMRespDto<>(1,"Adding Todo success",createTodoReqDto));
	}
	
	

	
	@PutMapping("/complete/todo/{todoCode}")
	public ResponseEntity<?> setCompleteTodo(@PathVariable int todoCode){
		boolean status = false;
		try {
			status = todoService.updateTodoComplete(todoCode);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,"failed",status));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,"success",status));
	}
	
	@PutMapping("/Importance/todo/{todoCode}")
	public ResponseEntity<?> setImportanceTodo(@PathVariable int todoCode){
		boolean status = false;
		try {
			status = todoService.updateTodoImportance(todoCode);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,"failed",status));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,"success",status));
	}
	
	@PutMapping("/todo/{todoCode}")
	public ResponseEntity<?> setTodo(@PathVariable int todoCode, @RequestBody UpdateTodoReqDto updateTodoReqDto){
		boolean status = false;
		try {
			updateTodoReqDto.setTodoCode(todoCode);
			status = todoService.updateTodoImportance(todoCode);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,"failed",status));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,"success",status));
	}
	
	@DeleteMapping("/todo/{todoCode}")
	public ResponseEntity<?> removeTodo(@PathVariable int todoCode){
		boolean status = false;
		try {
			status = todoService.removeTodo(todoCode);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(new CMRespDto<>(-1,"failed",status));
		}
		
		return ResponseEntity.ok().body(new CMRespDto<>(1,"success",status));
		
		
	}
	
	
	
	
}
