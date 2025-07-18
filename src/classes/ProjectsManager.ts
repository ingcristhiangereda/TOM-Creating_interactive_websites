import { IProject, Project } from "./Project"
import { v4 as uuidv4 } from 'uuid'



export function showModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if  (!modal.open){
        modal.showModal();
    }
    
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

export function closeModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement
  

  constructor(container: HTMLElement) {
    this.ui = container   

    this.newProject({
      name: "Default Project",
      description: "This is just a default app project",
      status: "pending",
      userRole: "architect",
      finishDate: new Date(),
      ToDoTask: [],
	    ToDoStatus: [],
	    ToDoID: [],
      
    })
  }

  


  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
      return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      // throw new Error(`A project with the name "${data.name}" already exists`)
      const index = this.list.findIndex(project => project.name === data.name);
      const id= this.list[index].id;
      const project = this.list[index];
      console.log("imprimiendo DATA ANTES DE ENTRAR A UPDATEPROJECT")
      console.log("-----------------------------")
      console.log(data)
      this.updateProject(id, data,  project)
    }else{
      const project = new Project(data)
      project.ui.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!(projectsPage && detailsPage)) { return }
        projectsPage.style.display = "none"
        detailsPage.style.display = "flex"
        this.setDetailsPage(project)
      })
      this.ui.append(project.ui)
      this.list.push(project)	
      return project
    }
    
  }

  setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details");
    const projectsPage = document.getElementById("projects-page");

    if (!detailsPage || !projectsPage) return;

    // Oculta la lista y muestra los detalles
    projectsPage.style.display = "none";
    detailsPage.style.display = "flex";

    // Limpia el contenido anterior y agrega el nuevo
    detailsPage.innerHTML = "";

    // Contenedor principal con flex horizontal
    const layoutContainer = document.createElement("div");
    layoutContainer.style.display = "flex";
    layoutContainer.style.gap = "20px"; // espacio entre columnas

    // Columna izquierda (50%)
    const leftColumn = document.createElement("div");
    leftColumn.style.flex = "1"; // 50% si el derecho es 1 también
    leftColumn.style.display = "flex";
    leftColumn.style.flexDirection = "column";
    leftColumn.style.gap = "20px";
    leftColumn.style.padding="30px 0";
    leftColumn.appendChild(project.DetailsUi);
    leftColumn.appendChild(project.ToDoUi);

    // Columna derecha (100%)
    const rightColumn = document.createElement("div");
    rightColumn.style.flex = "1"; // 50% si el izquierdo es 1 también
    rightColumn.appendChild(project.WorkSpaceUi);

    // Agrega columnas al layout
    layoutContainer.appendChild(leftColumn);
    layoutContainer.appendChild(rightColumn);

    // Agrega layout al contenedor de detalles
    detailsPage.appendChild(layoutContainer);

    const editProjectBtn = document.getElementById("edit-btn");
    if (editProjectBtn) {
        editProjectBtn.addEventListener("click", () => {


        const form = document.getElementById("new-project-form") as HTMLFormElement;
        form.reset();
        form.removeAttribute("data-mode");
        form.removeAttribute("data-project-id");
        showModal("new-project-modal");
 
      });
    } else {
      console.warn("New projects button was not found");
    }

    const toDoBtn = document.getElementById("add-ToDo-btn");
    if(toDoBtn){
      toDoBtn.addEventListener("click", () => {
        const form = document.getElementById("ToDo-form") as HTMLFormElement;
        form.reset();
        form.removeAttribute("data-mode");
        form.removeAttribute("data-project-id");
        showModal("new-ToDo-modal");
      })
    }



}


  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id
    })
    return project
  }
  
  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    project.ui.remove()
    const remaining = this.list.filter((project) => {
      return project.id !== id
    })
    this.list = remaining
  }
  
  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
  


importFromJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.addEventListener('change', () => {
    const filesList = input.files;
    if (!filesList) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = reader.result;
 
      if (!json) return;

      try {
        const rawProjects: IProject[] = JSON.parse(json as string);

        for (const raw of rawProjects) {
          try {
            console.log("imprimiendo proyecto antes de entrar a new project")
            console.log("--------------------------------------------------")
            console.log(raw)
            // Asegúrate de que cada proyecto se cree como instancia de Project
            this.newProject({
              ...raw,
              // finishDate: new Date(raw.finishDate) // convertir string a Date si es necesario
            });
          } catch (error) {
            console.warn("Error importing project:", error);
          }
        }
      } catch (e) {
        console.error("Invalid JSON format", e);
      }
    };

    reader.readAsText(filesList[0]);
  });

  input.click();
  }


  updateProject(id: string, updatedData: IProject,  project: Project): void {
  const index = this.list.findIndex(p => p.id === id);
  if (index !== -1) {
    const existingProject = this.list[index];

    // Actualiza los datos del proyecto
    existingProject.name = updatedData.name;
    existingProject.description = updatedData.description;
    existingProject.status = updatedData.status;
    existingProject.userRole = updatedData.userRole;
    existingProject.finishDate = updatedData.finishDate;

    existingProject.ToDoTask = updatedData.ToDoTask;
    existingProject.ToDoStatus = updatedData.ToDoStatus;
    existingProject.ToDoID = updatedData.ToDoID;
    console.log("imprimiendo proyecto actualizado")
    console.log("------------------------------")
    console.log(existingProject)
    existingProject.setDetailsUI()
    existingProject.setToDoUI()

    
  
 
  } else {
    throw new Error("Project not found");
  }
  }

  AddToDo(id: string, ToDo: string,  Status: string): void {

    const index = this.list.findIndex(p => p.id === id);
    if (index !== -1) {
    const existingProject = this.list[index];
    existingProject.ToDoTask.push(ToDo)
    existingProject.ToDoStatus.push(Status)
    existingProject.ToDoID.push(uuidv4())
    existingProject.setToDoUI()
    this.setDetailsPage(existingProject)


    }
  }
  // Agregar evento onclick a cada fila
  updateToDo(id:string, Status:string): void{

  }

}

