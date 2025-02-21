import { getGreeting } from "./utils/greeting";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import {
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
  useTodos,
} from "./hooks/useTodos";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  TextField,
  Form,
  Label,
  Input,
  Select,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  getLocalTimeZone,
  today,
  isEqualDay,
  DateValue,
  parseZonedDateTime,
  toCalendarDate,
  CalendarDate,
} from "@internationalized/date";
import { Priority } from "./types/todo";
import { useState } from "react";
import { useUserName, useSelectedProject } from "./hooks/useMetaState";
import {
  useProjects,
  useProjectActions,
  type Project,
} from "./hooks/useProjects";

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
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

  const minDate =
    todos.length > 0
      ? todos.reduce<CalendarDate>((min, todo) => {
          const todoDate = toCalendarDate(parseZonedDateTime(todo.createdAt));
          return todoDate.compare(min) < 0 ? todoDate : min;
        }, toCalendarDate(parseZonedDateTime(todos[0].createdAt)))
      : today(getLocalTimeZone());

  const handleSubmit = (title: string, priority: Priority) => {
    addTodo(title, priority, selectedProject || undefined);
  };

  const isSameDay = (date1: DateValue, date2: DateValue) => {
    return isEqualDay(date1, date2);
  };

  const filteredTodos = todos.filter(
    (todo) =>
      isSameDay(
        selectedDate,
        toCalendarDate(parseZonedDateTime(todo.createdAt))
      ) &&
      (selectedProject === null ? !todo.projectId : todo.projectId === selectedProject)
  );

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputName);
    setSettingsDialogOpen(false);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, { name: newProjectName });
    } else {
      addProject({ name: newProjectName });
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
    setSelectedProject(key === "all" ? null : key.toString());
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setDeleteConfirmationOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="min-h-dvh [--aside-width:280px]">
      <aside className="fixed w-[var(--aside-width)] inset-y-0 left-0 bg-white border-r border-gray-200">
        <Calendar
          aria-label="Appointment date"
          className="p-6"
          maxValue={today(getLocalTimeZone())}
          minValue={minDate}
          value={selectedDate}
          onChange={setSelectedDate}
        >
          <header className="flex items-center justify-between mb-6">
            <Button
              slot="previous"
              className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <ChevronLeft size={16} />
            </Button>
            <Heading className="text-sm font-medium text-gray-600" />
            <Button
              slot="next"
              className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <ChevronRight size={16} />
            </Button>
          </header>
          <CalendarGrid className="gap-0.5">
            {(date) => (
              <CalendarCell
                date={date}
                className="flex items-center justify-center size-8 rounded-sm text-sm font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-900 data-[selected]:bg-gray-900 data-[selected]:text-white data-[unavailable]:text-gray-300 data-[outside-month]:text-gray-300 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            )}
          </CalendarGrid>
        </Calendar>
      </aside>
      <main className="pl-[var(--aside-width)]">
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
                  <SelectValue>
                    {selectedProject === "all"
                      ? "No Project"
                      : projects.find((p) => p.id === selectedProject)?.title ||
                        "No Project"}
                  </SelectValue>
                  <ChevronRight className="size-4 rotate-90" />
                </Button>
                <Popover className="w-48">
                  <ListBox className="p-1 bg-white rounded-lg shadow-lg border border-gray-200">
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
                      <div className="p-6 space-y-6">
                        <Heading
                          slot="title"
                          className="text-xl font-semibold text-gray-900"
                        >
                          Settings ⚙️
                        </Heading>

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
                            <h3 className="text-sm font-medium text-gray-700">
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
                      </div>
                    </Dialog>
                  </Modal>
                </ModalOverlay>
              </DialogTrigger>
            </div>
          </div>
        </header>
        <div className="container max-w-3xl py-12">
          <div className="flex flex-col gap-8">
            <h3 className="font-bold tracking-tight text-gray-900 text-2xl">
              Toodoos 📝
            </h3>
            <TodoForm
              onSubmit={handleSubmit}
              selectedProject={
                selectedProject && selectedProject !== "all"
                  ? selectedProject
                  : undefined
              }
            />
            <TodoList
              todos={filteredTodos}
              selectedDate={selectedDate}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        </div>
      </main>

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
              <Heading
                slot="title"
                className="text-xl font-semibold text-gray-900"
              >
                {editingProject ? "Edit Project" : "New Project"} 📁
              </Heading>

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
              <Heading slot="title" className="text-xl font-semibold text-gray-900">
                Delete Project
              </Heading>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone and will delete all todos within this project.
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
    </div>
  );
}

export default App;
