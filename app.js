//this is for list input

const listsContainer = document.querySelector("[data-lists]")
const newListForm = document.querySelector("[data-new-list-form]")
const newListInput = document.querySelector("[data-new-list-input]")
const deleteListButton = document.querySelector("[data-delete-list-button]")


//this is for task section 

const listDisplayContainer = document.querySelector("[data-list-display-container]")
const listTitleElement = document.querySelector("[data-list-title]")
const listCountElement = document.querySelector("[data-list-count]")
const tasksContainer = document.querySelector("[data-tasks]")
const newTaskForm = document.querySelector("[data-new-task-form]")
const newTaskInput = document.querySelector("[data-new-task-input]")
const clearCompleteTaskButton = document.querySelector("[data-clear-complete-task-button]")

// this is to simplify the template for creatinng element for task

const tasktemplate = document.querySelector('#task-template')



//locally stored data key here!

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'



//locally stored data here!

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

window.onload=()=>{
    listDisplayContainer.style.display='none'
}

// eventlistner for the form (create list)

newListForm.addEventListener('submit', e=>{
    e.preventDefault()
    listDisplayContainer.style.display=''
    const listName = newListInput.value
    if(listName===null ||  listName==="") return
    const list = createList(listName)
    newListInput.value=null
    lists.push(list)
    saveAndRender()
    
})

// function to create list

function createList(name){
    return {id: Date.now().toString(), name: name , tasks:[] }
}



function saveAndRender(){
    save()
    render()
}



function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedListId)
}



function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild) 
    }
   }

// Render the list created

function renderLists(){
    lists.forEach(list =>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList=("list-name")
        listElement.innerText=list.name

        if(list.id=== selectedListId){
           listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)
    })

}

//delete list

deleteListButton.addEventListener('click', e=>{
    lists = lists.filter(list=> list.id!== selectedListId)
    selectedListId=null
    saveAndRender()

})

// click function for any of the list created

listsContainer.addEventListener('click',e=>{
    if(e.target.tagName.toLowerCase()==='li'){

        //selectedlistId originates here and saved using save() function.
       
        selectedListId=e.target.dataset.listId
        saveAndRender()
    }
})


// the main function

function render(){

    clearElement(listsContainer)

    renderLists()

    const selectedList = lists.find(list=>list.id===selectedListId)

    if(selectedListId===null){
     listDisplayContainer.style.display='none'
    }else{
        listDisplayContainer.style.display=''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}


//submit function for form task

newTaskForm.addEventListener('submit', e=>{
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName===null ||  taskName==="") return
    const task = createTask(taskName)
    newTaskInput.value=null
    const selectedList = lists.find(list=>list.id===selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
    
})


//create tasks from task input

function createTask(name){
    return {id: Date.now().toString(), name: name , complete: false
    }
}



//render the task created for the particular list

function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(tasktemplate.content , true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector("label")
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
   }



//counts the task remaining

function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.textContent=`${incompleteTaskCount} ${taskString} remaining`

}

tasksContainer.addEventListener('click',e=>{
    if(e.target.tagName.toLowerCase()==="input"){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id=== e.target.id)
        selectedTask.complete= e.target.checked
        save()
        renderTaskCount(selectedList)
    }

})

clearCompleteTaskButton.addEventListener('click', e=>{
    const selectedList = lists.find(list=> list.id===selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})


//finally calling the main function()

render()