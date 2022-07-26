package com.juhyeon.todolist.domain.todo;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper //마이바티스 라이브러리가 필수
public interface TodoRepository {
	public int save(Todo todo) throws Exception;
	public List<Todo> getTodoListOfIndex(Map<String, Object>map) throws Exception;
}
