package com.juhyeon.todolist.service.todo;

import org.springframework.stereotype.Service;

import com.juhyeon.todolist.domain.todo.Todo;
import com.juhyeon.todolist.domain.todo.TodoRepository;
import com.juhyeon.todolist.web.dto.todo.CreateTodoReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoServiceimpl implements TodoService{
	
	private final TodoRepository todoRepository;
	
	
	
	@Override
	public boolean createTodo(CreateTodoReqDto createTodoReqDto) throws Exception {
			Todo todoEntity = createTodoReqDto.toEntity();
			return todoRepository.save(todoEntity)>0;
			
		
	
	}
	
}
