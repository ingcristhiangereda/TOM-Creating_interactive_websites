import { IProject, ProjectStatus, UserRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";

export function showModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal();
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

const projectsListUI = document.getElementById("projects-list") as HTMLElement;

const projectsManager = new ProjectsManager(projectsListUI);

// Botón para crear nuevo proyecto
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    const form = document.getElementById("new-project-form") as HTMLFormElement;
    form.reset();
    form.removeAttribute("data-mode");
    form.removeAttribute("data-project-id");
    showModal("new-project-modal");
  });
} else {
  console.warn("New projects button was not found");
}



// Formulario de creación/edición
const projectForm = document.getElementById("new-project-form") as HTMLFormElement | null;

if (projectForm){
  projectForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const projectsPage = document.getElementById("projects-page")
    const detailsPage = document.getElementById("project-details")
    const formData = new FormData(projectForm);
      const name = (formData.get("name") as string).trim();
      
      const nameError = document.getElementById("name-error");
      if (name.length < 5) {
        if (nameError) {
          nameError.textContent = "The name must be at least 5 characters.";
          nameError.style.display = "block";
        } else {
          alert("The name must be at least 5 characters.");
        }
        return;
      } else if (nameError) {
        nameError.style.display = "none";
      }
      const projectData: IProject = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as ProjectStatus,
        userRole: formData.get("userRole") as UserRole,
        finishDate: new Date(formData.get("finishDate") as string)
      };
    if (detailsPage?.style.display === "none"){

 
      const project = projectsManager.newProject(projectData);
      
    }
    if (projectsPage?.style.display === "none"){
        const card_details = document.getElementsByClassName("dashboard-card_details")
        const name=card_details[0].querySelector('h2[data-project-info="name"]')?.textContent;       
        const index = projectsManager.list.findIndex(project => project.name === name);
        const id= projectsManager.list[index].id
        const project=projectsManager.list[index]
        const projectData: IProject = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          status: formData.get("status") as ProjectStatus,
          userRole: formData.get("userRole") as UserRole,
          finishDate: new Date(formData.get("finishDate") as string),
          ToDoTask: project.ToDoTask,
	        ToDoStatus: project.ToDoStatus,
	        ToDoID: project.ToDoID,
        };
        
        projectsManager.updateProject(id,projectData, project)
        projectsManager.setDetailsPage(project)

        
        

    }
    projectForm.reset();
    closeModal("new-project-modal");
    projectForm.removeAttribute("data-mode");
    projectForm.removeAttribute("data-project-id");
    
  })
}

const ToDoForm = document.getElementById("ToDo-form") as HTMLFormElement | null;
if(ToDoForm){
  ToDoForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const card_details = document.getElementsByClassName("dashboard-card_details")
    const name=card_details[0].querySelector('h2[data-project-info="name"]')?.textContent;       
    const index = projectsManager.list.findIndex(project => project.name === name);
    const id= projectsManager.list[index].id
    const formData = new FormData(ToDoForm);
    const ToDo = (formData.get("ToDo") as string)
    const Status = (formData.get("Status") as string)
    const project=projectsManager.list[index]
    projectsManager.AddToDo(id,ToDo, Status)
    ToDoForm.reset();
    closeModal("new-ToDo-modal");
    ToDoForm.removeAttribute("data-mode");
    ToDoForm.removeAttribute("data-project-id");

  })
}



// Botón para exportar proyectos
const exportProjectsBtn = document.getElementById("export-projects-btn");
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON();
  });
}

// Botón para importar proyectos
const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON();
  });
}




const editToDoForm = document.getElementById("edit-ToDo-form") as HTMLFormElement | null;
if (editToDoForm) {
  editToDoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const indexAttr = editToDoForm.getAttribute("data-task-index");
    if (indexAttr !== null) {
      const index = parseInt(indexAttr);
      const formData = new FormData(editToDoForm);
      const updatedStatus = formData.get("Status") as string;

      // Actualiza el estado en el proyecto actual
      const cardDetails = document.querySelector(".dashboard-card_details");
      const projectName = cardDetails?.querySelector('h2[data-project-info="name"]')?.textContent;
      const projectIndex = projectsManager.list.findIndex(p => p.name === projectName);
      const project = projectsManager.list[projectIndex];

      project.ToDoStatus[index] = updatedStatus;

      // Vuelve a renderizar la sección ToDo
      project.setToDoUI();
      projectsManager.setDetailsPage(project);
    }

    closeModal("edit-ToDo-modal");
  });
}

const projectTab=document.getElementById("projects-tab")
if (projectTab){
  projectTab.addEventListener("click", function () {
    const projectDetails=document.getElementById("project-details")
    
    if (projectDetails){
      projectDetails.style.display = "none";
    }
    const projectPage=document.getElementById("projects-page")
    if (projectPage){     
      projectsManager.setProjectPage()
      projectPage.style.display = "flex";
    }

  })
}

  






