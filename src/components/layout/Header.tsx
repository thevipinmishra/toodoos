import { Settings, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField,
} from "react-aria-components";
import { getGreeting } from "../../utils/greeting";
import { useState } from "react";
import { useUserName } from "../../hooks/useMetaState";
import { toast } from "sonner";

export const Header = () => {
  const { name, setName } = useUserName();
  const [inputName, setInputName] = useState(name);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputName);
    setSettingsDialogOpen(false);
    toast.success("Name updated successfully");
  };

  return (
    <header className="bg-white py-4 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <p className="text-gray-600 text-sm font-medium">
          {getGreeting()}
          {name ? `, ${name}` : ""}
        </p>

        <DialogTrigger
          isOpen={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
        >
          <Button className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1">
            <Settings size={16} />
          </Button>
          <ModalOverlay
            isDismissable
            className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto"
          >
            <Modal className="w-full max-w-md bg-white rounded-lg shadow-lg">
              <Dialog className="outline-0">
                {({ close }) => (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between gap-6">
                      <Heading
                        slot="title"
                        className="text-xl font-semibold text-gray-900"
                      >
                        Settings ⚙️
                      </Heading>

                      <Button
                        aria-label="Close settings dialog"
                        onPress={close}
                        className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
                      >
                        <X className="size-5" />
                      </Button>
                    </div>

                    <Form
                      onSubmit={handleNameSubmit}
                      className="space-y-4"
                      aria-label="User settings form"
                    >
                      <TextField className="space-y-2" autoComplete="off">
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
                  </div>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
    </header>
  );
};
