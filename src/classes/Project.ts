import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
  name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
  ToDoTask: String[]
	ToDoStatus: String[]
	ToDoID: String[]


}

export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	status: "pending" | "active" | "finished"
	userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  ToDoTask: String[]
  ToDoStatus: String[]
  
  
  //Class internals
  ui: HTMLDivElement
  DetailsUi:HTMLDivElement
  ToDoUi:HTMLDivElement
  WorkSpaceUi:HTMLDivElement
  cost: number = 0
  progress: number = 0
  id: string
  ToDoID: String[]

  constructor(data: IProject) {
    
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.userRole = data.userRole;
    this.finishDate = new Date(data.finishDate); // asegúrate de convertirlo

    // this.ToDoTask = this.ToDoTask || [];
    // this.ToDoStatus = this.ToDoStatus || [];
    // this.ToDoID = this.ToDoID || [];
    this.ToDoTask = data.ToDoTask || [];
    this.ToDoStatus = data.ToDoStatus || [];
    this.ToDoID = data.ToDoID || [];
    this.id = uuidv4()
    this.setUI()
    this.setDetailsUI()
    this.setToDoUI()
    this.setWorkSpaceUI()
  }

  formatDate(date: Date): string {
  const d = (date instanceof Date && !isNaN(date.getTime()))
    ? date
    : new Date("1995-08-08"); // fallback por defecto

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
  }

  //creates the project card UI
  setUI() {
    if (this.ui) {return}
    const colors = ["#ca8134", "#4a90e2", "#7ed6df", "#f1c40f", "#9b59b6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.ui = document.createElement("div")
    this.ui.className = "project-card"
    this.ui.innerHTML = `
    <div class="card-header">
      <p style="background-color:${randomColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${this.name.substring(0, 2).toUpperCase()}</p>
      <div>
        <h5>${this.name}</h5>
        <p>${this.description}</p>
      </div>
    </div>
    <div class="card-content">
      <div class="card-property">
        <p style="color: #969696;">Status</p>
        <p>${this.status}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Role</p>
        <p>${this.userRole}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Cost</p>
        <p>$${this.cost}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Estimated Progress</p>
        <p>${this.progress * 100}%</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Date</p>
        <p>${this.formatDate(this.finishDate)}</p>
      </div>
    </div>`
  }

  

  setDetailsUI(){
    this.DetailsUi = document.createElement("div")
    this.DetailsUi.className = "dashboard-card_details"
    this.DetailsUi.id="dashboard-card_details"
    this.DetailsUi.innerHTML = `
      <header>
        <div>
          <h2 data-project-info="name">${this.name}</h2>
          <p style="color: #969696">${this.description}</p>
        </div>
      </header>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0px 30px; margin-bottom: 30px;">
              <p style="font-size: 20px; background-color: #ca8134; aspect-ratio: 1; border-radius: 100%; padding: 12px;">${this.name.substring(0, 2).toUpperCase()}</p>
              <button id="edit-btn" class="btn-secondary"><p style="width: 100%;">Edit</p></button>
      </div>
      <div style="padding: 0 30px;">
        <div>
          <h5>${this.name}</h5>
          <p>${this.description}</p>
        </div>
        <div style="display: flex; column-gap: 30px; padding: 30px 0px; justify-content: space-between;">
          <div>
            <p style="color: #969696; font-size: var(--font-sm)">Status</p>
            <p>${this.status}</p>
          </div>
          <div>
            <p style="color: #969696; font-size: var(--font-sm)">Cost</p>
            <p>$${this.cost}</p>
          </div>
          <div>
            <p style="color: #969696; font-size: var(--font-sm)">Role</p>
            <p>${this.userRole}</p>
          </div>
          <div>
            <p style="color: #969696; font-size: var(--font-sm)">Finish Date</p>
            <p>${this.formatDate(this.finishDate)}</p>
          </div>
        </div>
        <div style="background-color: #404040; border-radius: 9999px; overflow: auto;">
          <div style="width: 80%; background-color: green; padding: 4px 0; text-align: center;">80%</div>
        </div>
      </div>
    `
    
  }
  
// <button id="add-task-btn" class="material-icons-round"  cursor: pointer;">add</button</div>

  setToDoUI(){
    this.ToDoUi = document.createElement("div")
    this.ToDoUi.className = "dashboard-card_To-Do"
    this.ToDoUi.id="dashboard-card_To-Do"
    let tableHTML="";

    if (this.ToDoTask.length!==0) {
      console.log("HAY TASK!");    
      this.ToDoTask.forEach((task, index) => {
          console.log(`Tarea ${index + 1}: ${task}`);
        });     
      tableHTML += `
            <table id= "ToDo-table" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr class="ToDo-header">
                  <th style="padding: 10px; border: 1px solid #ccc;">No</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">ToDo</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Status</th>
                </tr>
              </thead>
              <tbody>
          `;     
      this.ToDoTask.forEach((task, index) => {
        const status = this.ToDoStatus[index] || "N/A";
        const statusClass = status.toLowerCase(); // "pending", "active", "finished"
        tableHTML += `
          <tr class="todo-row ${statusClass}" data-id="${index}">
            <td style="padding: 10px; border: 1px solid #ccc;">${index + 1}</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${task}</td>
            <td style="padding: 10px; border: 1px solid #ccc;">${status}</td>
          </tr>
        `;
      });


      tableHTML += `
          </tbody>
        </table>
      `;


      
    }else{
      console.log(" no HAY TASK!")
    }
    this.ToDoUi.innerHTML = `
    <div style="padding: 20px 30px; display: flex; align-items: center; justify-content: space-between;">
      <h4>To-Do</h4>
      <div style="display: flex; align-items: center; justify-content: end; column-gap: 20px;">
        <div style="display: flex; align-items: center; column-gap: 10px;">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Search To-Do's by name" style="width: 100%;">               
        </div>
        <button id="add-ToDo-btn" class="material-icons-round"  cursor: pointer;">add</button</div>
      </div>             
    </div>
    <div style="display: flex; flex-direction: column; padding: 10px 30px; row-gap: 20px;">
      <div class="todo-item">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; column-gap: 15px; align-items: center;">
            <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
            <p>Make anything here as you want, even something longer.</p>
          </div>
          <p style="text-wrap: nowrap; margin-left: 10px;">Fri, 20 sep</p>
        </div>
      </div>
    </div>
    `+tableHTML

  
  const rows = this.ToDoUi.querySelectorAll(".todo-row");
  rows.forEach(row => {
    row.addEventListener("click", () => {
      const id = row.getAttribute("data-id");
      if (!id) return;

      const index = parseInt(id);
      const task = this.ToDoTask[index];
      const status = this.ToDoStatus[index];

      const form = document.getElementById("edit-ToDo-form") as HTMLFormElement;
      if (form) {
        form.reset();
        const statusSelect = form.elements.namedItem("Status") as HTMLSelectElement;
        form.setAttribute("data-task-index", id);

        const modal = document.getElementById("edit-ToDo-modal") as HTMLDialogElement;
        if (modal && !modal.open) {
          modal.showModal();
        }
        }
      });
    })

  }

  

  setWorkSpaceUI(){
    this.WorkSpaceUi = document.createElement("div")
    this.WorkSpaceUi.className = "WorkSpace"
    this.WorkSpaceUi.id = "WorkSpace"
    this.WorkSpaceUi.innerHTML = `
    <div> WORK SPACE
    </div>
    `
  }
}