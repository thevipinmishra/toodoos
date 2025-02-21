import { ChevronRight, Edit2, Plus, Settings, Trash2, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { getGreeting } from "../../utils/greeting";
import { Project } from "../../types/project";
import { useState } from "react";
import { useProjectActions, useProjects } from "../../hooks/useProjects";
import { useSelectedProject, useUserName } from "../../hooks/useMetaState";
import { toast } from "sonner";

export const Header = () => {
  const { name, setName } = useUserName();
  const [inputName, setInputName] = useState(name);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const { selectedProject, setSelectedProject } = useSelectedProject();
  const projects = useProjects();
  const { addProject, updateProject, deleteProject } = useProjectActions();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputName);
    setSettingsDialogOpen(false);
    toast.success("Name updated successfully");
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, { name: newProjectName });
      toast.success("Project updated successfully");
    } else {
      addProject({ name: newProjectName });
      toast.success("Project created successfully");
    }
    setNewProjectName("");
    setEditingProject(null);
    setProjectDialogOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProjectName(project.title);
    setProjectDialogOpen(true);
  };

  const handleProjectSelection = (key: React.Key) => {
    if (key === "new-project") {
      setEditingProject(null);
      setNewProjectName("");
      setProjectDialogOpen(true);
    } else {
      setSelectedProject(key === "all" ? null : key.toString());
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      toast.success("Project deleted successfully");
      setDeleteConfirmationOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <header className="bg-white py-4 border-b border-gray-200">
        <div className="container flex items-center justify-between">
          <p className="text-gray-600 text-sm font-medium">
            {getGreeting()}
            {name ? `, ${name}` : ""}
          </p>

          <div className="flex items-center gap-2">
            <Select
              selectedKey={selectedProject || "all"}
              aria-label="Project selection"
              onSelectionChange={handleProjectSelection}
              className="relative"
            >
              <Button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1 flex items-center gap-2">
                <SelectValue />

                <ChevronRight className="size-4 rotate-90" />
              </Button>

              <Popover className="w-48">
                <ListBox className="p-1 bg-white rounded-lg space-y-1 shadow-lg border border-gray-200">
                  <ListBoxItem
                    id="all"
                    className="px-2 py-1.5 text-sm text-gray-700 rounded cursor-pointer outline-none data-[selected]:bg-gray-100 data-[focused]:bg-gray-50"
                  >
                    No Project
                  </ListBoxItem>
                  {projects.map((project) => (
                    <ListBoxItem
                      key={project.id}
                      id={project.id}
                      className="px-2 py-1.5 text-sm text-gray-700 rounded cursor-pointer outline-none data-[selected]:bg-gray-100 data-[focused]:bg-gray-50"
                    >
                      {project.title}
                    </ListBoxItem>
                  ))}
                  <ListBoxItem
                    id="new-project"
                    className="px-2 py-1.5 flex items-center text-sm text-green-900 bg-green-100 rounded cursor-pointer outline-none data-[selected]:bg-gray-100 data-[focused]:bg-green-200 transition-colors"
                  >
                    <Plus className="mr-2 size-4" /> New Project
                  </ListBoxItem>
                </ListBox>
              </Popover>
            </Select>

            <DialogTrigger
              isOpen={settingsDialogOpen}
              onOpenChange={setSettingsDialogOpen}
            >
              <Button className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1">
                <Settings size={16} />
              </Button>
              <ModalOverlay
                isDismissable
                className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto data-[entering]:motion-preset-fade  data-[entering]:motion-duration-100"
              >
                <Modal className="w-full max-w-md bg-white rounded-lg shadow-lg data-[entering]:motion-preset-blur-up  data-[entering]:motion-duration-150">
                  <Dialog className="outline-0">
                   {({close}) =>  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between gap-6">
                     <Heading
                        slot="title"
                        className="text-xl font-semibold text-gray-900"
                      >
                        Settings ⚙️
                      </Heading>

                      <Button aria-label="Close settings dialog" onPress={close} className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1">
                        <X className="size-5" />
                      </Button>
                     </div>

                      <Form
                        onSubmit={handleNameSubmit}
                        className="space-y-4"
                        aria-label="User settings form"
                      >
                        <TextField className="space-y-2">
                          <Label className="block text-sm font-medium text-gray-700">
                            Name
                          </Label>
                          <Input
                            name="name"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent"
                            aria-label="User name"
                          />
                        </TextField>
                        <Button
                          type="submit"
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200"
                        >
                          Save Changes
                        </Button>
                      </Form>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-800">
                            Projects
                          </h3>
                          <Button
                            onPress={() => {
                              setEditingProject(null);
                              setNewProjectName("");
                              setProjectDialogOpen(true);
                            }}
                            className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <span className="text-sm text-gray-700">
                                {project.title}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  onPress={() => handleEditProject(project)}
                                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                  <Edit2 size={14} />
                                </Button>
                                <Button
                                  onPress={() => handleDeleteProject(project)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          </div>
        </div>
      </header>

      <ModalOverlay
        isDismissable
        isOpen={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto"
      >
        <Modal
          isOpen={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
          className="w-[400px] bg-white rounded-lg shadow-lg"
        >
          <Dialog className="outline-0">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-6">
                <Heading
                  slot="title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {editingProject ? "Edit Project" : "New Project"} 📁
                </Heading>

                <Button 
                  aria-label="Close project dialog" 
                  onPress={() => setProjectDialogOpen(false)} 
                  className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <Form
                onSubmit={handleProjectSubmit}
                className="space-y-4"
                aria-label={
                  editingProject ? "Edit project form" : "New project form"
                }
              >
                <TextField className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </Label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent"
                    aria-label="Project name"
                  />
                </TextField>
                <Button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </Form>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      <ModalOverlay
        isOpen={deleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto"
      >
        <Modal className="w-[400px] bg-white rounded-lg shadow-lg">
          <Dialog role="alertdialog" className="outline-0">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-6">
                <Heading
                  slot="title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Delete Project
                </Heading>

                <Button 
                  aria-label="Close delete confirmation dialog" 
                  onPress={() => setDeleteConfirmationOpen(false)} 
                  className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{projectToDelete?.title}"? This
                action cannot be undone and will delete all todos within this
                project.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  onPress={() => setDeleteConfirmationOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onPress={confirmDeleteProject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-200"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
};
