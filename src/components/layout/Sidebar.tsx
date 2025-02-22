import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  InboxIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  Button,
  Calendar,
  Dialog,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  Separator,
  TextField,
} from "react-aria-components";
import { useProjects, useProjectActions } from "../../hooks/useProjects";
import { useState } from "react";
import { toast } from "sonner";
import WeekCalendarGrid from "../WeekCalendarGrid";
import { useSelectedProject } from "../../hooks/useMetaState";
import { Project } from "../../types/project";

export const Sidebar = ({
  selectedDate,
  setSelectedDate,
  minDate,
}: {
  selectedDate: DateValue;
  setSelectedDate: (date: DateValue) => void;
  minDate: CalendarDate;
}) => {
  const projects = useProjects();
  const { addProject, updateProject, deleteProject } = useProjectActions();
  const { selectedProject, setSelectedProject } = useSelectedProject();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      if (selectedProject === projectToDelete.id) {
        setSelectedProject(null);
      }
      toast.success("Project deleted successfully");
      setDeleteConfirmationOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <aside className="fixed hidden lg:block w-[var(--aside-width)] inset-y-0 left-0 bg-white border-r border-gray-200">
      <Calendar
        visibleDuration={{ weeks: 1 }}
        aria-label="Filter using date"
        className="p-4"
        maxValue={today(getLocalTimeZone())}
        minValue={minDate}
        value={selectedDate}
        onChange={setSelectedDate}
      >
        <header className="flex items-center justify-between mb-6">
          <Button
            slot="previous"
            className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
          </Button>
          <Heading className="text-sm font-medium text-gray-600" />
          <Button
            slot="next"
            className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronRight size={16} />
          </Button>
        </header>

        <div className="flex">
          <WeekCalendarGrid />
        </div>
      </Calendar>

      <Separator className="border-gray-300" />
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Projects</h2>
          <button
            onClick={() => {
              setEditingProject(null);
              setNewProjectName("");
              setProjectDialogOpen(true);
            }}
            className="size-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors outline-none ring-gray-200 focus-visible:ring-1"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          <div
            onClick={() => setSelectedProject(null)}
            className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
              !selectedProject
                ? "bg-gray-200 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <InboxIcon size={16} />
            <span>Hodgepodge</span>
          </div>
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group flex items-center justify-between px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                selectedProject === project.id
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span
                className="flex-1"
                onClick={() => setSelectedProject(project.id)}
              >
                {project.title}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalOverlay
        isDismissable
        isOpen={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto"
      >
        <Modal className="w-[400px] bg-white rounded-lg shadow-lg">
          <Dialog className="outline-0">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-6">
                <Heading
                  slot="title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {editingProject ? "Edit Project ✏️" : "New Project 📁"}
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
                aria-label="New project form"
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
          <Dialog className="outline-0">
            <div className="p-6 space-y-6">
              <Heading
                slot="title"
                className="text-xl font-semibold text-gray-900"
              >
                Delete Project
              </Heading>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  onPress={() => setDeleteConfirmationOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onPress={confirmDeleteProject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-red-200"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </aside>
  );
};
