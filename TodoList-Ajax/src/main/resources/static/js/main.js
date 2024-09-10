/* 할 일 추가 관련 요소를 얻어와 변수에 저장 */
const todoTitle = document.querySelector("#todoTitle");
const todoDetail = document.querySelector("#todoDetail");
const addBtn = document.querySelector("#addBtn");

// 추가 버튼(#addBtn) 클릭 시
addBtn.addEventListener("click", () => {

  // 클릭된 순간 화면에 작성되어있는 제목, 내용 얻어오기
  const title = todoTitle.value;
  const detail = todoDetail.value;

  // Ajax(비동기) POST 방식으로 요청하기 위한 fetch() API 코드 작성
  
  // HTTP 통신 시 
  // - headers : 요청 관련 정보(어떤 데이터, 어디서 요청 ....)
  // - body : POST/PUT/DELETE 요청 시 전달할 데이터

  fetch("/todo/add", {   // 지정된 주소로 비동기 요청(ajax)
      method : "POST",  // 데이터 전달 방식을 POST로 지정
      headers: {"Content-Type": "application/json"}, // 요청 데이터의 형식을 JSON으로 지정     
      body : JSON.stringify( {"todoTitle" : title, "todoDetail" : detail} ) 
            // JS객체를 JSON 형태(문자열화)로 변환하여 Body에 추가
  })
  .then(response => response.text() ) // 요청에 대한 응답 객체(response)를 필요한 형태로 파싱
  // response.text() : 컨트롤러 반환 값을 text형태로 변환
  //                   (아래 두 번째 then 매개 변수로 전달)

  .then(result => {
    console.log("result : ", result);

    // 비동기 통신 응답 결과가 1인 경우(삽입 성공인 경우)
    if(result > 0){ 
      alert("할 일 추가 성공");

      // 추가하려고 작성한 값 화면에서 지우기
      todoTitle.value = "";
      todoDetail.value = "";

      // 비동기로 전체 할 일 개수를 조회해 화면에 반영하기
      getTotalCount();

      // 전체 할 일 목록을 조회해서 화면에 반영(출력)
      selectTodoList();

    } else {
      alert("할 일 추가 실패...");
    }

  }); // 첫 번째 then에서 파싱한 데이터를 이용한 동작 작성

});


// ---------------------------------------------------------------



/* 전체 Todo 개수 비동기(ajax) 조회 */
function getTotalCount(){

  // fetch() API 작성  (fetch : 가져오다)

  /* GET 방식 fetch() */
  fetch("/todo/totalCount") // 비동기 요청 수행 -> Promise 객체 반환
  .then(response => {
    // response : 비동기 요청에 대한 응답이 담긴 객체
    console.log(response)

    // 비동기 요청에 대한 응답에 문제가 없을 경우
    // == 비동기 요청 성공 시
    //if(response.status === 200) // 아래 if문과 같은 의미
    if(response.ok){
      // response.text() : 응답 결과 데이터를
      //    text(string) 형태로 변환(parsing)
      return response.text();
    }

    // 예외 강제 발생
    throw new Error("비동기 통신 실패");
  })

  // 첫 번째 then에서 반환된 값을 매개 변수에 저장한 후
  // 수행되는 구문
  .then(totalCount => {
    console.log("totalCount : ", totalCount);

    // #totalCount 요소의 내용으로 비동기 통신 결과를 대입
    document.querySelector("#totalCount").innerText = totalCount;
  })

  // 첫 번째 then에서 던져진 Error를 잡아서 처리하는 구문
  .catch(e => console.error(e));
}


// ----------------------------------------------------------

/* 완료된 할 일 개수 비동기로 조회 */
function getCompleteCount(){

  /* 첫 번째 then
   - 비동기 요청의 결과(응답)에 따라 어떤 코드를 수행할지 제어
   - 매개변수 response : 
        응답 결과, HTTP 상태 코드, 요청 주소 등이 담겨 있는 객체
 
 
   * 두 번째 then
   - 비동기 요청으로 얻어온 값을 이용해서 수행될 JS 코드 작성하는 구문
  */

  fetch("/todo/completeCount") // 비동기 요청해서 결과 데이터 응답 받아오겠다
  .then(response => {
    if(response.ok){ // 비동기 통신 성공 시(HTTP 상태 코드 200)
      return response.text(); // response에서 응답 결과를
                              // text 형태로 변환해서 반환
                              // -> 두 번째 then 매개 변수에 대입
    }

    // 요청 실패 시 예외(에러) 던지기 -> catch 구문에서 처리
    throw new Error("완료된 할 일 개수 조회 실패");
  })

  .then(count => {
    console.log("완료된 할 일 개수 : ", count);
    document.querySelector("#completeCount").innerText = count; 
  })

  .catch( e => {console.error(e)});
}

// ---------------------------------------------------------------

/**
 * 비동기로 할 일 목록 전체 조회
 */
function selectTodoList(){

  fetch("/todo/todoList")
  .then(response => {
    if(response.ok) return response.text();
    throw new Error("목록 조회 실패 : " + response.status);
  })
  .then(result => {
    // JSON(List 형태) -> JS 객체 배열
    const todoList = JSON.parse(result); 
    console.log(todoList);

    /* #tbody 내용을 모든 지운 후 조회된 내용의 요소 추가 */

    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    // JS 향상된 for문 : for(요소 of 배열){}
    for(let todo of todoList){

      // 1) todoNo가 들어갈 th 요소 생성
      const todoNo = document.createElement("th");
      todoNo.innerText = todo.todoNo;

      // 2) todoTitle이 들어갈 td, a 요소 생성
      const todoTitle = document.createElement("td");

      const a = document.createElement("a");
      a.innerText = todo.todoTitle;
      a.href = `/todo/detail/${todo.todoNo}`;
      
      // a 요소를 todoTitle(td)요소 자식으로 추가
      todoTitle.append(a);

      // 3) todoComplete가 들어갈 th 요소 생성
      const todoComplete = document.createElement("th");
      todoComplete.innerText
        = (todo.todoComplete == 1) ? 'O' : 'X';

      // 4) regDate가 들어갈 td 요소 생성
      const regDate = document.createElement("td");
      regDate.innerText = todo.regDate;

      // 5) tr 요소를 만들어 1,2,3,4 에서 만든 요소 자식으로 추가
      const tr = document.createElement("tr");
      tr.append(todoNo, todoTitle, todoComplete, regDate);

      // 6) tbody에 tr 요소 자식으로 추가
      tbody.append(tr);
    }
  })
  .catch( e => console.error(e) );
}