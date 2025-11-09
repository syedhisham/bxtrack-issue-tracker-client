import React from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

interface SeededUser {
  name: string;
  email: string;
}

interface SeededUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (email: string) => void;
}

const seededUsers: SeededUser[] = [
  { name: "Syed Hisham Shah", email: "syedhishamshah27@gmail.com" },
  { name: "Ali Ahmed", email: "aliahmed@gmail.com" },
  { name: "Fatima Khan", email: "fatimakhan@gmail.com" },
  { name: "Ahmed Hassan", email: "ahmedhassan@gmail.com" },
  { name: "Muhammad Zain", email: "muhammadzain@gmail.com" },
  { name: "Ayesha Malik", email: "ayeshamalik@gmail.com" },
];

export const SeededUsersModal: React.FC<SeededUsersModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const handleUserClick = (email: string) => {
    onSelectUser(email);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl border border-border w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
          <h2 className="text-xl font-bold text-text-primary">Seeded Users</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white transition-colors duration-150 text-text-secondary hover:text-text-primary"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-text-secondary mb-4">
            Click on any user to automatically fill their email in the sign-in form.
          </p>
          <div className="space-y-2">
            {seededUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleUserClick(user.email)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface hover:border-primary transition-all duration-150 text-left group"
              >
                <Avatar
                  name={user.name}
                  size="md"
                  src={`https://avatar.iran.liara.run/public/${index + 1}.png`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3 text-text-secondary" />
                    <p className="text-sm text-text-secondary truncate">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

