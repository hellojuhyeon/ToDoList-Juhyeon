const selectedTypeButton = document.querySelector(".selected-type-button");
const typeSelectBoxList = document.querySelector(".type-select-box-list");
const typeSelectBoxListLis = typeSelectBoxList.querySelectorAll("li"); 
const todoContentList = document.querySelector(".todo-content-list");
const sectionBody = document.querySelector(".section-body");
const incompleteCountNumber = document.querySelector(".incomplete-count-number");

let page = 1;
let totalPage = 0;

sectionBody.onscroll = () => {
   let checkNum = todoContentList.clientHeight - sectionBody.offsetHeight - sectionBody.scrollTop;
   
   if(checkNum < 1 && checkNum > -1&&page<totalPage){
      alert("새로운 리스트 추가로 가져오기");
      page++;
      load();
   }
}


let listType = "incomplete";

load();

selectedTypeButton.onclick = () => {
  typeSelectBoxList.classList.toggle("visible");
}

for(let i = 0; i < typeSelectBoxListLis.length; i++){
   
   typeSelectBoxListLis[i].onclick = () => {
      for(let i = 0; i < typeSelectBoxListLis.length; i++){
         typeSelectBoxListLis[i].classList.remove("type-selected");
      }
      
      
      const selectedType = document.querySelector(".selected-type");
      
      typeSelectBoxListLis[i].classList.add("type-selected");
      
      listType = typeSelectBoxListLis[i].textContent.toLowerCase();   
      
      selectedType.textContent = typeSelectBoxListLis[i].textContent;
      
      todoContentList.innerHTML = "";
      
      load();   
      
      typeSelectBoxList.classList.toggle("visible");
   }
}

function load() {
   $.ajax({
      type: "get",
      url: `/api/v1/todolist/list/${listType}`,
      data: {
         page: page,
         contentCount: 20
      },
      dataType: "json",
      success: (response) => {
         console.log(JSON.stringify(response));
         getList(response.data);
      },
      error: errorMessage
   })
}
function setTotalCount(totalCount){
   totalPage = totalCount % 20 == 0 ? totalCount / 20 : Math.floor(totalCount / 20) + 1
}

function getList(data) {
   incompleteCountNumber.textContent = data[0].incompleteCount;
   setTotalCount(data[0].totalCount);
   for(let content of data){
      const listContent = `
       <li class="todo-content">
            <input type="checkbox" id="complete-check-${content.todoCode}" class="complete-check" ${content.todoComplete ? 'checked' : ''}>
            <label for="complete-check-${content.todoCode}"></label>
            <div class="todo-content-text">${content.todo}</div>
            <input type="text" class="todo-content-input visible" value="${content.todo}">
            <input type="checkbox" id="importance-check-${content.todoCode}" class="importance-check"  ${content.importance ? 'checked' : ''}>
            <label for="importance-check-${content.todoCode}"></label>
            <div class="trash-button"><i class="fa-solid fa-trash"></i></div>
        </li>
      `
      todoContentList.innerHTML += listContent;

   }
}
function addEvent(){
	const todoContents = document.querySelector(".todo-content");
	
	for(let i = 0;i<todoContents.length;i++){
		let todoCode = todoCode = todoContents[i].querySelector(".complete-check").getAttribute("id");
		let index = todoCode.lastIndexOf("-");
		todoCode = todoCode.substring(index+1);
		
		console.log("id: " + todoCode);
		
		todoContents[i].querySelector(".complete-check").onchange = () =>{
				let incompleteCount = parseInt(incompleteCountNumber.textContent); 
			
				if(todoContent[i].querySelector(".complete-check").checked){
					
					incompleteCountNumber.textContent = incompleteCount-1;
				}else{
					incompleteCountNumber.textContent = incompleteCount+1;
				}
				updateCheckStatus("complete", todoContents[i],todoCode);
		}
		
		todoContents[i].querySelector(".importance-check").onchange = () =>{
				updateCheckStatus("importance", todoContents[i],todoCode);
		}
		
		todoContents[i].querySelector(".trash-button").onchange = () =>{
				deleteTodo(todoContents[i], todoCode)
		}
		const todoContentText = todoContents[i].querySelector(".todo-content-text");
		const todoContentInput = todoContents[i].querySelector(".todo-content-input");
		let todoContentValue = null;
		
		let eventFlag = false;
		
		todoContentText.onclick=()=>{
				todoContentValue = todoContentInput.value;
				todoContentText.classList.toggle("visible");
				todoContentInput.classList.toggle("visible");
				todoContentInput.focus();
				eventFlag = true;
		}
		let updateTodoContent = (todoCode)=>{
				if(tocoContentValue != todoContentInput.value){
					$.ajax({
						type: "put",
						url:`/api/v1/todolist/todo/${todoCode}`,
						contentType: "application/json",
						data: JSON.stringify({
							"todoCode":todoCode,
							todo: todoContentInput.value}),
						async:false,
						dataType:"json",
						success:(response)=>{
							if(response.data){
								todoContentText.textContent = todoContentInput.value;
							}
						},
						error:errorMessage
					})
				}
				todoContentText.classList.toggle("visible");
				todoContentInput.classList.toggle("visible");
			}
		
			todoContentInput.onblur = () =>{
				if(eventFlag){
					updateTodoContent();
			}
		
		}
				todoContentInput.onkeyup = ()=>{
					if(window.event.keyCode == 13){}
						eventFlag = false;
						updateTodoContent();
				
			}
			todoContentText.classList.toggle("visible");
			todoContentInput.classList.toggle("visible");
		}
	}

function updateStatus(type, todoCode){
	result = null;
$.ajax({
		type:"put",
		url:`/api/v1/todolist/${type}/todo/${todoCode}`,
		async:false,
		dataType:"json",
		success:(response)=>{
			result=response.data
			
		},
		error:errorMessage
	})
	return result;
}


function updateCheckStatus(type, todoContent, todoCode){
	let result = updateStatus("complete",todoCode);
	
	if(
		(
			(type == "complete"
			 && 
			 (listType == "complete"||listType =="incomplete")
			 )
			||
			(type == "importance" && listType=="importance")
			) 
			&& result
			){
		todoContentList.removeChild(todoContent);
		
	}
}

function deleteTodo(todoContent, todoCode){
	$.ajax({
		type:"delete",
		url:`/api/v1/todolist/todo/${todoCode}`,
		async:false,
		dataType:"json",
		success:(response)=>{
			if(response.data){
				todoContentList.removeChilde(todoContent);
			}
		},
		error:errorMessage
	})
}


function errorMessage(request, status, error ) {
   alert("요청 실패");
   console.log(request.status);
   console.log(request.responseText);
   console.log(error);
}